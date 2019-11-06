//using AgentCompensation.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using oak.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace oak.Models
{
    [Table("PB_Users")]
    public class Users : UsersFn
    {
        [Key]
        public int ID { get; set; }
        public string EmployeeCode { get; set; }

        [Column(TypeName = "tinyint")]
        public int RoleID { get; set; }

        [IgnoreDataMember]
        public string Password { get; set; }

        [NotMapped]
        public string Token { get; set; }

        public string AddBy { get; set; }

        [IgnoreDataMember]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime AddDate { get; set; }

        [IgnoreDataMember]
        [ForeignKey("RoleID")]
        public virtual Roles Roles { get; set; }

        [JsonProperty(PropertyName = "Add Date")]
        [ReadOnly(true)]
        public string AddDateFm => AddDate.ToString("dd/MM/yyyy");

        [NotMapped]
        public string RoleName { get; set; }

        [NotMapped]
        public DataTable Menu { get; set; }
    }
    public class UsersFn
    {
        public async Task<List<Users>> GetsAsync(EntityContextWEB context)
        {
            return await context.Users
                .Select(c => new Users { ID = c.ID, EmployeeCode = c.EmployeeCode, RoleName = c.Roles.RoleName, AddDate = c.AddDate })
                .ToListAsync();
        }

        public async Task<Users> InsertAsync(Users users, EntityContextWEB context)
        {
            users.AddBy = Current.UserID;
            context.Users.Add(users);
            await context.SaveChangesAsync();

            return users;
        }

        public async Task UpdateAsync(Users users, EntityContextWEB context)
        {
            var Users = context.Users;
            var u = Users.Attach(users);
            u.Property(c => c.EmployeeCode).IsModified = true;
            u.Property(c => c.AddBy).CurrentValue = Current.UserID;
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Users users, EntityContextWEB context)
        {
            context.Users.Remove(users);
            await context.SaveChangesAsync();
        }
        public async Task<Users> AdminLoginAsync(string username, string password, EntityContextWEB context)
        {
            if (string.IsNullOrEmpty(password))
                password = "";

            return await context.Users
                    .Include(c => c.Roles)
                    .Where(c => c.EmployeeCode == username)
                    .Select(c => new Users
                    {
                        EmployeeCode = c.EmployeeCode,
                        RoleName = c.Roles.RoleName
                    })
                    .FirstOrDefaultAsync();
        }

        public async Task<Users> EmployeeLoginAsync(string employeeCode, EntityContextDocpd context)
        {
            var payload = await context.Idoc_user
                    .Include(c => c.Idoc_Department)
                    .Where(c => c.User_employeecode == employeeCode)
                    .Select(c => new Users
                    {
                        EmployeeCode = employeeCode,
                        RoleName = c.Idoc_Department.Dept_department
                    })
                    .FirstOrDefaultAsync();


            string[] availableRoleNames = { "Agency Support", "Actuarial", "Information Technology" };


            if (payload == null || Array.FindIndex(availableRoleNames, m => m == payload.RoleName) == -1)
                payload.RoleName = "InternalEmployee";

            return payload;
        }

    }

}
