using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace oak.Models
{

    public class JWTModel
    {
        public string Token { get; set; }
        /// <summary>
        /// Default value is HmacSha256Signature,To avoid mistake wording, Use SecurityAlgorithms.somethings        
        /// PM> Install-Package Microsoft.IdentityModel.Tokens -Version 5.5.0
        /// </summary>
        public string SecurityAlgorithms { get; set; } = "http://www.w3.org/2001/04/xmldsig-more#hmac-sha256";

        public string SecretKey { get; set; }

        /// <summary>
        ///  Default value is 30 days
        /// </summary>
        public short ExpiresDate { get; set; } = 30;

        /// <summary>
        ///  Default value is True ,Token will expired only 24:00 of expiration date.
        /// </summary>
        public bool ExpiresAtMidnight { get; set; } = true;
        public Claim[] Claims { get; set; }
    }
}
