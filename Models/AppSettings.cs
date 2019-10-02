namespace oak.Models
{

    public class AppSettings
    {
        public JWTAppSetting JWT { get; set; }
        public DatabaseAppSetting Database { get; set; }
        public string ALIAS { get; set; }

        public FileSetting File { get; set; }
    }
    public class JWTAppSetting
    {
        public string SecretKey { get; set; }
        public short Expires { get; set; }
    }
    public class DatabaseAppSetting
    {
        public string FASTTRACKConnectionString { get; set; }
        public string WEBConnectionString { get; set; }
    }

    public class FileSetting
    {
        public string PB_PlanDocsInitialPath { get; set; }
        public string PB_AnnounceDocsInitialPath { get; set; }
    }


}
