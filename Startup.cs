using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using oak.Controllers;
using oak.Data;
using oak.Models;
using System.Net;
using System.Threading.Tasks;

namespace PlanBrochureCore3
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // <--- Chanage default json converter from system.text.json to Newtonsoft
            services.AddControllersWithViews().AddNewtonsoftJson();

            // <--- Copy whole values from AppSettings.json with Class:AppSettings
            var appSettingsSection = Configuration.GetSection(nameof(AppSettings));
            services.Configure<AppSettings>(appSettingsSection);

            // <--- Enable JWT authentication service.
            var app = appSettingsSection.Get<AppSettings>();
            var key = System.Text.Encoding.ASCII.GetBytes(app.JWT.SecretKey);
            services.AddAuthentication(opt =>
             {
                 opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                 opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
             })
             .AddJwtBearer(opt =>
             {
                 opt.RequireHttpsMetadata = false;
                 opt.SaveToken = false;
                 opt.TokenValidationParameters = new TokenValidationParameters
                 {
                     ValidateIssuerSigningKey = true,
                     IssuerSigningKey = new SymmetricSecurityKey(key),
                     ValidateIssuer = false,
                     ValidateLifetime = true,
                     ValidateAudience = false
                 };
                 opt.Events = new JwtBearerEvents
                 {
                     // <-- Change default JWT checker location from Request's Header to Cookie(named:"Authorization")
                     OnMessageReceived = context =>
                     {
                         context.Token = context.Request.Cookies["Authorization"];
                         return Task.CompletedTask;
                     }
                 };
             });

            //<-- Entity framework - Setup connectionstring.
            services.AddDbContext<EntityContextFASTTRACK>(options => options.UseSqlServer(app.Database.FASTTRACKConnectionString));
            services.AddDbContext<EntityContextWEB>(options => options.UseSqlServer(app.Database.WEBConnectionString));
            services.AddDbContext<EntityContextDocpd>(options => options.UseSqlServer(app.Database.DOCPDConnectionString));

            //<-- Register some helper classes to DI.
            services.AddScoped<oak.IUserService, oak.UserService>();
            services.AddScoped<oak.IDbServices, oak.DbServices>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public static void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory, IConfiguration configuration)
        {
            //<-- Allow display "Custom error page( หน้าเหลือง )" when running the web on Localhost.
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();

            //<-- Redirect to another page if Response HTTP Status is 400-5xx (Error, Notfound, somethings else...)
            app.UseStatusCodePages(async context =>
            {
                await Task.CompletedTask.ConfigureAwait(false);
                var response = context.HttpContext.Response;
                var ALIAS = "";

                if (!env.IsDevelopment())
                    ALIAS = "/" + configuration.GetSection(nameof(AppSettings)).GetSection(nameof(AppSettings.ALIAS)).Value + "/";

                if (response.StatusCode == (int)HttpStatusCode.Unauthorized)
                    response.Redirect(ALIAS + nameof(AuthenticationController.Login));
            });

            app.UseRouting();       //<-- Enable MVC service.
            app.UseAuthentication();//<-- Enable JWT Authorization service.
            app.UseAuthorization(); //<-- Enable JWT Authorization service.
            app.UseStaticFiles();  //<--  Enable static folder named: ~/wwwroot/*

            //<-- Setup Routing
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Authentication}/{action=login}/{id?}");
            });

            //<-- Logging whole request and response
            //<-- Log location: ~/Logs/middleware_{วันที่}.log
            Task.Run(() => loggerFactory.AddLog4Net());
        }
    }
}
