namespace oak.Models
{
    public static class UploadProfileModel
    {
        public static string UploadProfile { get; set; }
        public static int MaxFileSize { get; set; }
        public static string[] RejectFileType { get; set; }
        public static int MaxFileAmount { get; set; }
        
    }

    public static class RemoteStorageModel
    {
        //public static string InitialPath { get; set; }
        public static string Server { get; set; }
        public static string Server_LocalTesting { get; set; }   
    }
}

