<template>
  <v-table>
    <thead>
      <tr>
        <th class="table_col" v-for="[key, value] of Object.entries({
          'id': 'Код', 
          'name': 'Организация', 
          'comment': 'Комментарий'
          })"
          @click="sortHeader(key)"
        :class="{
            'sorted_asc': this.asc[key] === 1 || (this.$route.query.sort_type === key && this.$route.query.order_by === 'asc'),
            'sorted_desc': this.asc[key] === 2 || (this.$route.query.sort_type === key && this.$route.query.order_by === 'desc'),
            'not_sorted': this.asc[key] === 0
          }">{{ value }}
        </th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in organizations" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.comment }}</td>
        <td>
          <div class="action_buttons">
            <v-btn color="blue" @click="openEditDialog(item)" small
            >Изменить</v-btn
            >
            <v-btn color="blue" @click="openChangelogDialog(item)" small
            >История</v-btn
            >
            <v-btn color="red" @click="openDeleteDialog(item.id)" small
              >Удалить</v-btn
            >
          </div>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import OrganizationsApi from "./organizationsApi";
export default {
  data() {
    return {
      organizations: [],
      asc: {
        'id': 0,
        'name': 0,
        'comment': 0,
      },
    };
  },
  // mounted() {
  //   this.fetchOrganizations();
  // },
  methods: {
    sortHeader(field) {
      for (let [key, value] of Object.entries(this.asc)) {
        if (key != field) {
          this.asc[key] = 0
        }
      }
      if (this.asc[field] === 1) {
        this.asc[field] = 2
        this.$router.push({path: this.$route.fullPath, query: {
          page: this.$route.query.page,
          sort_type: field,
          order_by: 'desc'
        } })
        this.fetchOrganizationsPage(this.$route.query.page, field, 'desc');
      }
      else if (this.asc[field] === 2) {
        this.asc[field] = 0
        this.$router.push({path: this.$route.fullPath, query: {
          page: this.$route.query.page,}})
        this.fetchOrganizationsPage(this.$route.query.page);
      }
      else if (this.asc[field] === 0) {
        this.asc[field] = 1
        this.$router.push({path: this.$route.fullPath, query: {
          page: this.$route.query.page,
          sort_type: field,
          order_by: 'asc'
        } })
        this.fetchOrganizationsPage(this.$route.query.page, field, 'asc');
      }
    },
    openEditDialog(item) {
      this.$emit("edit", item);
    },
    openDeleteDialog(id) {
      this.$emit("delete", id);
    },
    fetchOrganizations() {
      OrganizationsApi.getOrganizations().then((data) => {
          this.organizations = data;
        }).catch((err) => {
          console.log(err)
        });
    },
    fetchOrganizationsPage(page, sort_type, order_by) {
      OrganizationsApi.getOrganizations(page, sort_type, order_by).then((data) => {
          this.organizations = data;
          this.$parent.pagination.pages = Math.ceil(parseInt(data[0].pages) / this.$parent.pagination.itemsPerPage);
        }).catch((err) => {
          console.log(err)
        });
    },
    openChangelogDialog(item) {
    this.$emit("changelog", item);
  },
  },
};
</script>