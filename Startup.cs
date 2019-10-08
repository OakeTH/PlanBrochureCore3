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
            //services.Configure<CookiePolicyOptions>(options =>
            //{
            //    options.CheckConsentNeeded = context => true;
            //    options.MinimumSameSitePolicy = SameSiteMode.None;
            //});

            //services.AddCors();

            //Chnage default json converter to Newtonsoft
            services.AddControllersWithViews().AddNewtonsoftJson();

            //Binding AppSettings.json with AppSettings
            var appSettingsSection = Configuration.GetSection(nameof(AppSettings));
            services.Configure<AppSettings>(appSettingsSection);

            // configure jwt authentication
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
                     OnMessageReceived = context =>
                     {
                         context.Token = context.Request.Cookies["Authorization"];
                         return Task.CompletedTask;
                     }
                 };
             });

            // Entity framework - Serup connectionstring.
            services.AddDbContext<EntityContextFASTTRACK>(options => options.UseSqlServer(app.Database.FASTTRACKConnectionString));
            services.AddDbContext<EntityContextWEB>(options => options.UseSqlServer(app.Database.WEBConnectionString));

            // configure DI for application services
            services.AddScoped<oak.IUserService, oak.UserService>();
            services.AddScoped<oak.IDbServices, oak.DbServices>();


            // Register Blazor service.
            // services.AddRazorPages();
            // services.AddServerSideBlazor();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public static void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory, IConfiguration configuration)
        {
            //if (env.IsDevelopment())
            //    app.UseDeveloperExceptionPage();
            //else
            //    app.UseExceptionHandler("/Home/Error");

            //<-- Redirect to another page if Response HTTP Status  400-5xx
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

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseStaticFiles();

            //<-- Setup Routing
            app.UseEndpoints(endpoints =>
            {
                //   endpoints.MapBlazorHub();

                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Authentication}/{action=login}/{id?}");
            });

            //<-- Logging
            Task.Run(() => loggerFactory.AddLog4Net());
        }
    }
}
