using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using oak.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using static oak.Models.ServicesModels;

namespace oak
{
    public interface IDbServices
    {
        DataSet SpCaller(string name, List<P> parameters = null, IDictionary<object, object> requestItem = null, string connectionstring = null);
        string ToJson(DataSet dataSet);
    }
    public class DbServices : IDbServices
    {
        private readonly AppSettings appSettings;
        public DbServices(IOptions<AppSettings> _appSettings)
        {
            appSettings = _appSettings.Value;
        }
        public string ToJson(DataSet dataSet)
        {
            return SharedServices.DsToJson(dataSet);
        }

        public DataSet SpCaller(string name, List<P> parameters = null, IDictionary<object, object> requestitem = null, string Connectionstring = null)
        {
            if (requestitem != null && requestitem.Count > 0)
                foreach (var item in requestitem)
                {
                    if (item.Key.GetType().Name == "String")
                        parameters.Add(new P { Key = (string)item.Key, Value = (string)item.Value });
                };

            var me = new DbServicesModel
            {
                Name = name,
                Parameters = parameters,
                RequestItem = requestitem,
                Connectionstring = Connectionstring
            };
            return SpCaller(me);

        }
        public DataSet SpCaller(DbServicesModel model)
        {
            if (model.Connectionstring == null)
                model.Connectionstring = appSettings.Database.WEBConnectionString;

            DataSet ds = new DataSet();
            SqlConnection connection = new SqlConnection(model.Connectionstring);
            SqlCommand cmd = new SqlCommand()
            {
                CommandType = CommandType.StoredProcedure,
                Connection = connection,
                CommandText = model.Name
            };

            if (model.Parameters != null)
                for (short i = 0; i < model.Parameters.Count; i++)
                {
                    SeperatesParam(cmd: cmd, args: model.Parameters[i], Connectionstring: model.Connectionstring);
                }

            try

            {
                using SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception ex) { throw ex; }
            finally
            {
                connection.Close();
                connection.Dispose();
            }
            return ds;
        }
        private void SeperatesParam(SqlCommand cmd, P args, string Connectionstring)
        {
            var prefix = "DATA_";
            if (args.Key.ToUpper().StartsWith(prefix))
            {
                string key = args.Key.Remove(0, prefix.Length);
                if (args.Value is string str)
                {
                    if (str != "[]" && str != "null" && str != "")
                        return;

                    if (str.StartsWith("{") && str.EndsWith("}") || str.StartsWith("[") && str.EndsWith("]"))
                    {
                        DataTable dt = SharedServices.JsonToDT(str);
                        MappingDataTableWithUserDefined(conn: Connectionstring, dataTable: dt, userDefinedName: key);
                        cmd.Parameters.AddWithValue(key, SharedServices.JsonToDT(str));
                    }
                }

                if (args.Value is DataTable dataTable)
                    cmd.Parameters.AddWithValue(
                        parameterName: key,
                        value: MappingDataTableWithUserDefined(conn: Connectionstring, dataTable: dataTable, userDefinedName: key));

            }
            else
                cmd.Parameters.AddWithValue(args.Key, args.Value);
        }
        public static List<P> GetRequestParametor(IFormCollection Request_Form = null)
        {
            List<P> args = new List<P>();
            if (Request_Form != null)
                foreach (var obj in Request_Form)
                {
                    args.Add(new P { Key = obj.Key, Value = obj.Value });
                }

            return args;
        }


        public static DataTable MappingDataTableWithUserDefined(string conn, DataTable dataTable, string userDefinedName = null)
        {
            //<-- UsTypeNm = User Defined Table type --<<
            //  if (UsTypeNm == null) return ExternalDT;
            if (dataTable == null || dataTable.Rows.Count == 0)
                return dataTable;


            //(string name, int orderby)[] UsTypeCols = null;

            //List<P> args = new List<P>
            //{
            //    new P { Key = "url", Value = "dbo.sqlservices" },
            //    new P { Key = "if", Value = "Get_table_types_columns" },
            //    new P { Key = "TableName", Value = UsTypeNm }
            //};
            //DataSet _UsTypeCols = CallSP(conn, args);
            //DataColumn[] ExternalCols = null;

            //if (_UsTypeCols.Tables[0].Rows.Count == 0)
            //    return ExternalDT;

            //UsTypeCols = _UsTypeCols.Tables[0].Rows.OfType<DataRow>()
            //    .Select(k => (k[0].ToString().ToUpper(), (int)k[1])).ToArray();

            //ExternalCols = ExternalDT.Columns.OfType<DataColumn>().ToArray();

            ////<-- Remove External columns is not exists in User Defined Table type's columns -----<<
            //foreach (var Col in ExternalCols)
            //{
            //    if (!Array.Exists(UsTypeCols, us => us.name == Col.ToString().ToUpper()))
            //        ExternalDT.Columns.Remove(Col);
            //}

            // <--- Add missing columns to External columns ,According to User Defined Table type's columns -------<<
            // foreach (var (name, orderby) in UsTypeCols)
            // {


            //if (!Array.Exists(ExternalCols, ex => ex.ToString().ToUpper() == name))
            //{
            //    if (name == "ID")
            //    {
            DataColumn IdentityCol = new DataColumn
            {
                DataType = typeof(int),
                ColumnName = "RunNumber"
            };
            dataTable.Columns.Add(IdentityCol);

            for (int i = 0; i < dataTable.Rows.Count; i++)
            {
                dataTable.Rows[i]["RunNumber"] = i + 1;
            }
            dataTable.Columns["RunNumber"].SetOrdinal(0);

            DataColumn errorMsg = new DataColumn
            {
                DataType = typeof(string),
                ColumnName = "Import Result"
            };
            dataTable.Columns.Add(errorMsg);
            for (int i = 0; i < dataTable.Rows.Count; i++)
            {
                dataTable.Rows[i]["Import Result"] = "";
            }
            dataTable.Columns["Import Result"].SetOrdinal(1);

            //}
            //else
            //{
            //    //     DataColumn dc = ExternalDT.Columns.Add(Col)
            //    DataColumn dc = new DataColumn
            //    {
            //        DataType = Type.GetType("System.String"),
            //        ColumnName = name,
            //    };
            //    ExternalDT.Columns.Add(dc);
            //}
            // }
            // }

            //< --- Sort External columns according to User Defined Table type's columns -------<<
            //foreach (var (name, orderby) in UsTypeCols)
            //{
            //    ExternalDT.Columns[name].SetOrdinal(orderby - 1);
            //}

            return dataTable;

        }
    }

    //public static class IQueryableExtensions
    //{
    //    private static readonly TypeInfo QueryCompilerTypeInfo = typeof(QueryCompiler).GetTypeInfo();
    //    private static readonly FieldInfo QueryCompilerField = typeof(EntityQueryProvider).GetTypeInfo().DeclaredFields.First(x => x.Name == "_queryCompiler");
    //    private static readonly FieldInfo QueryModelGeneratorField = QueryCompilerTypeInfo.DeclaredFields.First(x => x.Name == "_queryModelGenerator");
    //    private static readonly FieldInfo DataBaseField = QueryCompilerTypeInfo.DeclaredFields.Single(x => x.Name == "_database");
    //    private static readonly PropertyInfo DatabaseDependenciesField = typeof(Database).GetTypeInfo().DeclaredProperties.Single(x => x.Name == "Dependencies");
    //    public static string ToSql<TEntity>(this IQueryable<TEntity> query) where TEntity : class
    //    {
    //        var queryCompiler = (QueryCompiler)QueryCompilerField.GetValue(query.Provider);
    //        var modelGenerator = (QueryModelGenerator)QueryModelGeneratorField.GetValue(queryCompiler);
    //        var queryModel = modelGenerator.ParseQuery(query.Expression);
    //        var database = (IDatabase)DataBaseField.GetValue(queryCompiler);
    //        var databaseDependencies = (DatabaseDependencies)DatabaseDependenciesField.GetValue(database);
    //        var queryCompilationContext = databaseDependencies.QueryCompilationContextFactory.Create(false);
    //        var modelVisitor = (RelationalQueryModelVisitor)queryCompilationContext.CreateQueryModelVisitor();
    //        modelVisitor.CreateQueryExecutor<TEntity>(queryModel);
    //        return modelVisitor.Queries.First().ToString();
    //        // return sql;
    //    }
    //}


}
