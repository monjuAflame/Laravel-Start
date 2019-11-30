<template>
    <div class="container">
        <div class="row" v-if='$gate.isAdminOrAuthor()'>
          <div class="col-md-12 mt-5">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Users Table</h3>

                <div class="card-tools">
                  <button class='btn btn-success' @click='newModel'>
                    <i class="fa fa-user-plus fa-fw"></i>
                    Add New
                  </button>
                </div>
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Created At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>

                    <tr v-for="user in users.data" :key='user.id'>
                      <td>{{ user.id }}</td>
                      <td>{{ user.name }}</td>
                      <td>{{ user.email }}</td>
                      <td>{{ user.type | upText }}</td>
                      <td>{{ user.created_at | myDate }}</td>
                      <td>
                        <a href="#" @click='editModel(user)'>
                            <i class="fa fa-edit blue fa-fw"></i>
                        </a>
                        /
                        <a href="#" @click="deleteUser(user.id)">
                            <i class="fa fa-trash red fa-fw"></i>
                        </a>
                      </td>
                    </tr>
                    
                  </tbody>
                </table>
              </div>
              <div class="card-footer">
                <pagination :data="users" @pagination-change-page="getResults"></pagination>
              </div>
            </div>
          </div>
          </div>

        <div v-if='!$gate.isAdminOrAuthor()'>
          <not-found></not-found>
        </div>

    <!-- modal -->
    <div class="modal fade" id="addNew" tabindex='-1' role='dialog' aria-labelledby='addNewModalLabel' aria-hidden='true'>
        <div class="modal-dialog modal-dialog-centered" role='document'>
            <div class="modal-content">

                <div class="modal-header">
                    <h5 v-show='!editmode' class="modal-title"  id="addNewModalLabel">Add New</h5>
                    <h5 v-show='editmode' class="modal-title"  id="addNewModalLabel">Update User</h5>
                    <button class="close" type='button' data-dismiss='modal' aria-label='Close'>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                </div>
                <form @submit.prevent="editmode ? updateUser() : CreateUser()" >
                <div class="modal-body">
                  
                  <div class="form-group">
                    <input v-model="form.name" type="text" name="name"
                      placeholder="Username " 
                      class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                    <has-error :form="form" field="name"></has-error>
                  </div>

                  <div class="form-group">
                    <input v-model="form.email" type="text" name="email"
                      placeholder="Email " 
                      class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                    <has-error :form="form" field="email"></has-error>
                  </div>

                  <div class="form-group">
                    <textarea v-model="form.bio" type="text" name="bio"
                      placeholder="Shot bio for user " 
                      class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
                    <has-error :form="form" field="bio"></has-error>
                  </div>

                  <div class="form-group">
                    <select v-model="form.type" type="text" name="type"
                      class="form-control" :class="{ 'is-invalid': form.errors.has('type') }">
                        <option value="">User Role</option>
                        <option value="admin">Admin</option>
                        <option value="user">Standard User</option>
                        <option value="author">Author</option>
                    </select>
                    <has-error :form="form" field="type"></has-error>
                  </div>

                  <div class="form-group">
                    <input v-model="form.password" type="text" name="password"
                      placeholder="Password " 
                      class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                    <has-error :form="form" field="password"></has-error>
                  </div>



                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" data-dismiss='modal'>
                        <i class="fa fa-trash fa-fw"></i>
                        Close
                    </button>
                    <button v-show='!editmode' type="submit" class="btn btn-primary">
                        <i class="fa fa-save fa-fw"></i>
                        Save
                    </button>
                    <button v-show='editmode' type="submit" class="btn btn-primary">
                        <i class="fa fa-save fa-fw"></i>
                        Update
                    </button>
                </div>
              </form>
            </div>
        </div>
    </div>




    </div>
</template>

<script>
    export default {
        data() {
            return {
                editmode: false,
                users :{},
                form : new Form({
                     id: '',
                     name: '',
                     email: '',
                     password: '',
                     type: '',
                     bio: '',
                     photo: '',

                })
            }
        },
        methods: {
            getResults(page = 1) {
              axios.get('api/user?page=' + page)
                .then(response => {
                  this.users = response.data;
                });
            },
            updateUser() {
                this.$Progress.start();
                this.form.put('api/user/'+this.form.id)
                .then(()=>{
                    Fire.$emit('loadData');
                    $('#addNew').modal('hide');
                    Toast.fire({
                            icon: 'success',
                            title: 'Update in successfully'
                          });
                this.$Progress.finish();
                })
                .catch(()=>{
                  this.$Progress.fail()
                })
                
            },
            editModel(user){
              this.editmode = true;
              this.form.reset();
              $('#addNew').modal('show');
              this.form.fill(user);
            },
            newModel(){
              this.editmode = false;
              this.form.reset();
              $('#addNew').modal('show');
            },
            deleteUser(id) {
                Swal.fire({
                  title: 'Are you sure?',
                  text: "You won't be able to revert this!",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                  if (result.value) {

                    this.form.delete('api/user/'+id).then(()=>{
                        Swal.fire(
                          'Deleted!',
                          'Your file has been deleted.',
                          'success'
                        )
                      Fire.$emit('loadData');
                    }).catch(()=>{
                      Swal.fire('Failed','Ops Something Wrong','warning');
                    })
                    
                  }
                })
            },
            loadUsers(){
               if (this.$gate.isAdminOrAuthor()) {
                // axios.get('api/user').then(({ data }) => (this.users = data.data));
                //for pagination
                axios.get('api/user').then(({ data }) => (this.users = data));
               }
            },
            CreateUser () {
              this.$Progress.start()
              this.form.post('api/user')
              .then(()=>{
                Fire.$emit('loadData');
                $('#addNew').modal('hide');
                Toast.fire({
                            icon: 'success',
                            title: 'Create in successfully'
                          });
                this.$Progress.finish();
              })
              .catch(()=>{
                this.$Progress.fail();
                 Toast.fire({
                            icon: 'error',
                            title: 'Ops !'
                          });
              })
            }

        },
        created() {
           Fire.$on('searcing',()=>{
              let query = this.$parent.search;
              axios.get('api/findUser?q=' + query)
              .then((data)=>{
                this.users = data.data;
              })
              .then(()=>{
                
              })
            });

            this.loadUsers();
            // setInterval(() => this.loadUsers(), 3000);
            Fire.$on('loadData',()=>{
              this.loadUsers();
            });
        }
    }
</script>
