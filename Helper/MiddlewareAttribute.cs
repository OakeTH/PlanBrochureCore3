using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.WebUtilities;
using Newtonsoft.Json;
using oak.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using static System.Net.WebRequestMethods;
namespace oak
{
    /// <summary>
    /// Clone all of parametors each Request.From , Request.Body , Request.QueryString to Request.HttpContext.Items
    /// </summary>
    public class SetParameterToRequestItemAttribute : Attribute, IResourceFilter
    {
        public void OnResourceExecuting(ResourceExecutingContext context)
        {
            var Request = context.HttpContext.Request;

            //<------- Get -------------<<
            if (Request.Method == Http.Get)
            {
                if (!string.IsNullOrEmpty(Request.QueryString.Value))
                {
                    var items = QueryHelpers.ParseQuery(Request.QueryString.Value);
                    foreach (var item in items)
                    {
                        context.HttpContext.Items[item.Key] = (string)item.Value;
                    }
                }
            }
            //<------- Post Body -------------<<
            else if (Request.ContentType == ContentTypes.json)
            {
                string body;
                using (var reader = new StreamReader(Request.Body))
                {
                    body = reader.ReadToEnd();
                }
                if (!string.IsNullOrEmpty(body))
                {
                    var items = JsonConvert.DeserializeObject<Dictionary<string, string>>(body);
                    foreach (var item in items)
                    {
                        context.HttpContext.Items[item.Key] = item.Value;
                    }
                }
            }
            //<------- Post From -------------<<
            else if (context.HttpContext.Request.ContentType != null && context.HttpContext.Request.ContentType.StartsWith(ContentTypes.form))
            {
                foreach (var item in context.HttpContext.Request.Form)
                {
                    context.HttpContext.Items[item.Key] = (string)item.Value;
                }
            }
        }

        public void OnResourceExecuted(ResourceExecutedContext context) { }
    }

    /// <summary>
    /// Get current UserID from JWT Token and set the data to "Current.UserID" (static int)
    /// // Return Null if not exists.
    /// </summary>
    public class GetCurrentUserAttribute : Attribute, IResourceFilter
    {
        public void OnResourceExecuting(ResourceExecutingContext context)
        {

            if (context.HttpContext.User?.Identity is ClaimsIdentity claimsIdentity)
            {
                Current.UserID = claimsIdentity?.FindFirst("u")?.Value;
                Current.RoldName = claimsIdentity?.FindFirst("r")?.Value;
            }
        }

        public void OnResourceExecuted(ResourceExecutedContext context) { }
    }

}
