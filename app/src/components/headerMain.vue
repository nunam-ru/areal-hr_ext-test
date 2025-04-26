<template>
<v-app-bar app color="#abcdef">
    <v-toolbar-title>HR-manager</v-toolbar-title>
    <span class="mr-4">
    {{ fullName }}
    </span>
    <v-btn @click="logOut">
    Выход
    </v-btn>
</v-app-bar>
<logoutDialog
    :logOutDialog="logOutDialog"
    @update:logOutDialog="logOutDialog = $event"
/>

</template>

<script>
    import logoutDialog from "@/components/logoutDialog.vue";
    import authApi from "@/modules/auth/authApi";

    export default {
    components: {
        logoutDialog,
    },
    data() {
        return {
            logOutDialog: false,
            fullName: "",
        };
    },
    async mounted() {
        this.getFullName();
    },
    methods: {
        async getFullName() {
            this.fullName = await authApi.getUserFullName();
        },
        logOut() {
            this.logOutDialog = true;
        },
    },
    };
</script>
  