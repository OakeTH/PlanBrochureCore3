//<---------------------------------------------------------------------------------------<<
//<---------------------------------- v.3.4-----------------------------------------------<<
//<---------------------------------------------------------------------------------------<<
//using AgetnCompensation.Models;
using ClosedXML.Excel;
using ExcelDataReader;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using oak.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using static oak.Models.ServicesModels;

namespace oak
{
    public static class SharedServices
    {
        //private static void SeperatesParam(string conn, SqlCommand cmd, P item)
        //{
        //    if (item.Key == "url")
        //    { cmd.CommandText = (string)item.Value; }
        //    else if (item.Key.ToUpper().StartsWith("DATA_"))
        //    {
        //        if (item.Value != "[]" && item.Value != "null" && item.Value != "")
        //        {
        //            string key = item.Key.Remove(0, 5);
        //            cmd.Parameters.AddWithValue(key, AdjustExternalDT(conn, JsonToDT(item.Value), key));
        //        }
        //    }
        //    else
        //    { cmd.Parameters.AddWithValue(item.Key, item.Value); }
        //}
        public static string DsToJson(DataTable td) => JsonConvert.SerializeObject(td);
        public static string DsToJson(DataSet ds)
        {
            string[] ignoreTable = { "Scheme", "Data" };
            Int16 number = 0;
            foreach (DataTable x in ds.Tables)
            {
                if (ignoreTable.Any(x.TableName.Contains) == false)
                {
                    x.TableName = Convert.ToString(number);
                    number += 1;
                }
            }
            return JsonConvert.SerializeObject(ds);
        }
        public static DataTable JsonToDT(string jsonString)
        {
            return (DataTable)JsonConvert.DeserializeObject(jsonString, typeof(DataTable));
        }
        public static List<P> JsonToSPparams(string jsonstr)
        {
            if (jsonstr != null)
            {
                var dict = JsonToDictionary(jsonstr);
                List<P> args = new List<P>();
                foreach (var obj in dict) { args.Add(new P { Key = obj.Key, Value = obj.Value }); }
                return args;
            }
            else { return null; }
        }
        public static List<P> GetRequestParametor(IFormCollection Request_Form = null, List<P> parameter = null)
        {
            List<P> args = new List<P>();
            if (Request_Form != null)
                foreach (var obj in Request_Form)
                {
                    args.Add(new P { Key = obj.Key, Value = obj.Value });
                }

            //if (parameter != null)
            //    for (int i = 0; i < parameter.Count; i++)
            //    {
            //        args.Add(parameter[i]);
            //    }

            return args;
        }
        //public static string Query(string conn, List<P> arg = null, Dictionary<string, DataTable> dic = null)
        //{
        //    DataSet ds = CallSP(conn, arg, dic);
        //    if (ds == null) return null;
        //    else if (ds.Tables.Count == 1) return DsToJson(ds.Tables[0]);
        //    else return DsToJson(ds);
        //}
        //public static object Query(string conn, bool ingoreConvertJsonstr, List<P> arg = null, Dictionary<string, DataTable> dic = null)
        //{
        //    DataSet ds = CallSP(conn, arg, dic);
        //    if (ds.Tables.Count == 0)
        //    {
        //        DataTable dt = new DataTable();
        //        return dt;
        //    }
        //    else if (ds.Tables.Count == 1) return ds.Tables[0];
        //    else
        //    {
        //        for (int i = 0; i < ds.Tables.Count; i++)
        //        {
        //            ds.Tables[i].TableName = i.ToString();
        //        }
        //        return (ds);
        //    }
        //}
        //public static string Grid_Query(string conn, List<P> arg = null, Dictionary<string, DataTable> dic = null)
        //{
        //    DataSet ds = CallSP(conn, arg, dic);
        //    DataTable _dt = ds.Tables[0].Copy();
        //    DataSet _ds = new DataSet();
        //    var _dtNew = new DataTable();
        //    Int16 cIndex = 0;
        //    DataRow newRow = _dtNew.NewRow();
        //    String[] intTypes = { "Decimal", "Int32", "Int16", "Byte" };
        //    foreach (DataColumn c in _dt.Columns)
        //    {
        //        _dtNew.Columns.Add(cIndex.ToString());
        //        if (Array.IndexOf(intTypes, c.DataType.Name) > -1)
        //        {
        //            if (!c.ColumnName.Contains("^"))
        //            { c.ColumnName = (c.ColumnName + "^"); }
        //            c.ColumnName = (c.ColumnName + ",num");
        //        }
        //        else if ((c.DataType.Name == "Boolean"))
        //        {
        //            if (!c.ColumnName.Contains("^"))
        //            { c.ColumnName = (c.ColumnName + "^"); }
        //            c.ColumnName = (c.ColumnName + ",chk");
        //        }
        //        newRow[cIndex] = c.ColumnName;
        //        c.ColumnName = cIndex.ToString();
        //        cIndex++;
        //    }
        //    _dtNew.Rows.Add(newRow);
        //    _ds.Tables.AddRange(new DataTable[] { _dtNew, _dt });
        //    _ds.Tables[0].TableName = "Scheme";
        //    _ds.Tables[1].TableName = "Data";
        //    return DsToJson(_ds);
        //}
        //public static string DDL_Query(string conn, List<P> arg = null)
        //{
        //    DataSet ds = CallSP(conn, arg);
        //    //DataTable dt = ds.Tables[0].Copy();
        //    //if (dt.Rows.Count > 0)
        //    //{
        //    //    if ((dt.Columns.Count == 1))
        //    //        dt.Columns[0].ColumnName = "v";
        //    //    else
        //    //    {
        //    //        dt.Columns[0].ColumnName = "v";
        //    //        dt.Columns[1].ColumnName = "t";
        //    //    }
        //    //}
        //    return DsToJson(ds.Tables[0]);
        //}
        //public static DataSet CallSP(string conn, List<P> arg = null, Dictionary<string, DataTable> dic = null)
        //{
        //    DataSet ds = new DataSet();
        //    SqlConnection connection = new SqlConnection(conn);
        //    SqlCommand cmd = new SqlCommand()
        //    {
        //        CommandType = CommandType.StoredProcedure,
        //        Connection = connection
        //    };

        //    if (arg != null)
        //    {
        //        foreach (P item in arg) { SeperatesParam(conn, cmd, item); }
        //    }

        //    if (dic != null)
        //    {
        //        foreach (KeyValuePair<string, DataTable> entry in dic)
        //        {
        //            cmd.Parameters.AddWithValue(entry.Key.Replace(".", "_"), entry.Value);
        //        }
        //    }
        //    try
        //    {
        //        SqlDataAdapter da = new SqlDataAdapter(cmd);
        //        da.Fill(ds);
        //    }
        //    catch (Exception ex) { throw ex; }
        //    finally { connection.Close(); }
        //    return ds;
        //}
        public static MemoryStream ExcelStreaming(DataTable source, string SheetName = "", string Template = null, string LastRowIsSummary = "")
        {
            DataSet ds = new DataSet();
            ds.Tables.Add(source);
            return ExcelStreaming(ds, SheetName, Template, LastRowIsSummary);
        }
        public static MemoryStream ExcelStreaming(DataSet source, string SheetName = "", string Template = null, string LastRowIsSummary = "")
        {
            int index;
            string[] Sheets_Name;
            bool IsRegularEx = true;
            XLWorkbook wb = null;
            if (Template == null)
                wb = new XLWorkbook();
            else
                wb = new XLWorkbook(Template);

            MemoryStream MemoryStream = new MemoryStream();
            SheetName = SheetName.Contains(",") == false ? SheetName + "," : SheetName;

            if (source.GetType() == typeof(DataSet))
            {
                if (SheetName == ",")
                {
                    SheetName = "";
                    for (var i = 1; i <= (source as DataSet).Tables.Count; i++)
                        SheetName += "Sheet" + Convert.ToString(i) + ",";
                }
                else if (SheetName.Split(",").Length < (source as DataSet).Tables.Count)
                {
                    for (var i = 1; i <= (source as DataSet).Tables.Count - SheetName.Split(",").Length + 1; i++)
                    {
                        if (SheetName.Substring(SheetName.Length - 1, 1) != ",")
                            SheetName += ",";
                        SheetName += "Sheet" + Convert.ToString(i);
                    }
                }
                else if (SheetName == ",")
                {
                    SheetName = "";
                    for (var i = 1; i <= (source as DataSet).Tables.Count; i++)
                        SheetName += "Sheet" + Convert.ToString(i) + ",";
                }
            }
            else if (SheetName == ",") { SheetName = "Sheet1"; }

            Sheets_Name = SheetName.Split(",");

            //foreach (DataTable dt in (source as DataSet).Tables)
            //{
            //    foreach (DataColumn c in dt.Columns)
            //    {
            //        if (c.ColumnName.Contains("^")) { IsRegularEx = false; break; }
            //    }
            //    if (IsRegularEx == false) break;
            //}

            index = 0;
            if (IsRegularEx == true)
            {
                foreach (DataTable dt in (source as DataSet).Tables)
                {
                    IXLWorksheet wSheet = null;
                    try
                    {
                        if (Template != null) wSheet = wb.Worksheets.Worksheet(Sheets_Name[index]);
                        else wSheet = wb.Worksheets.Add(dt, Sheets_Name[index]);
                    }
                    catch { wSheet = wb.Worksheets.Add(dt, Sheets_Name[index]); }

                    CreateRegularExcFm(wSheet);

                    var LastRowIsSummaryArray = LastRowIsSummary.Split(',');
                    if (LastRowIsSummary == "allsheets" || Array.IndexOf(LastRowIsSummaryArray, Sheets_Name[index]) > -1)
                        SetLastRowSummary(wSheet);

                    index += 1;
                }
            }
            else
            {
                IXLWorksheet wSheet = null;
                if (Template == null)
                    wSheet = wb.Worksheets.Add(Sheets_Name[index]);
                else
                    wSheet = wb.Worksheet(Sheets_Name[index]);

                foreach (DataTable dt in (source as DataSet).Tables)
                {
                    if (dt.Columns.Count == 1)
                    {
                        if (dt.Columns[0].ColumnName == "gotonextsheet")
                        {
                            index += 1;
                            wSheet = wb.Worksheets.Add(Sheets_Name[index]);
                            continue;
                        }
                    }
                    //  CreateAdvancedExcFm(wSheet, dt);

                }
            }

            if (wb.Worksheets.Count > 0) { wb.SaveAs(MemoryStream); }
            MemoryStream.Position = 0;
            return MemoryStream;
        }
        private static void CreateRegularExcFm(IXLWorksheet s)
        {
            s.Style = XLWorkbook.DefaultStyle;
            s.Rows("1").Style.Alignment.SetVertical(XLAlignmentVerticalValues.Top);
            s.Rows("1").Height = 30;
            s.Style.Border.LeftBorder = XLBorderStyleValues.Thin;
            s.Style.Border.LeftBorderColor = XLColor.FromHtml("#dadcdd");
            s.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
            s.Style.Border.BottomBorderColor = XLColor.FromHtml("#dadcdd");
            s.Style.Font.FontColor = XLColor.FromHtml("#262626");
            s.Style.Fill.BackgroundColor = XLColor.FromHtml("#ffffff");
            s.Rows("1").Style.Font.FontColor = XLColor.FromHtml("#246374");
            s.SheetView.FreezeRows(1);
        }
        private static void SetLastRowSummary(IXLWorksheet s)
        {
            IXLRow item = s.LastRowUsed();
            item.Style.Fill.BackgroundColor = XLColor.FromHtml("#eeeeee");
            item.Style.Alignment.SetVertical(XLAlignmentVerticalValues.Center);
            item.Height = 25;
        }
        //private static void CreateAdvancedExcFm(IXLWorksheet ws, DataTable dt /*bool IsFirstDataTable*/)
        //{
        //    Int32 rowCount;
        //    Int32 rowCurrent;
        //    Int32 usedHeader = 0;
        //    Int32 rowCurrent_d;
        //    rowCount = dt.Rows.Count;
        //    //if (IsFirstDataTable)
        //    //    rowCurrent = 0;
        //    //else
        //    rowCurrent = ws.RowsUsed().Count();

        //    dt = CreateAdvancedExcFm_applyStylebyfirstCol(dt);
        //    foreach (DataColumn c in dt.Columns)
        //    {
        //        string markup = Substr(c.ColumnName, "^", "");
        //        if (c.ColumnName.Contains(",hd"))
        //        {
        //            IXLCell _ws = ws.Cell(rowCurrent + 1, c.Ordinal + 1);
        //            _ws.Value = Substr(c.ColumnName, "", "^");
        //            usedHeader = 1;
        //            if (markup.Contains(",hdfont-size"))
        //                _ws.Style.Font.FontSize = Convert.ToDouble(Substr(markup, ",hdfont-size", ","));
        //            if (markup.Contains(",hdfont-bold"))
        //                _ws.Style.Font.SetBold();
        //            if (markup.Contains(",hdcolor#"))
        //                _ws.Style.Font.FontColor = XLColor.FromHtml(Substr(markup, ",hdcolor", ","));
        //            if (markup.Contains(",hdcen"))
        //                _ws.Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
        //            if (markup.Contains(",hdright"))
        //                _ws.Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
        //            if (markup.Contains(",hdbg#"))
        //                _ws.Style.Fill.BackgroundColor = XLColor.FromHtml(Substr(markup, ",hdbg", ","));
        //            if (markup.Contains(",hdheight"))
        //                ws.Row(rowCurrent + 1).Height = Convert.ToDouble(Substr(markup, ",hdheight", ","));
        //            if (markup.Contains(",hdbd"))
        //                CreateAdvancedExcFm_border(_ws, markup, "1");
        //        }
        //        rowCurrent_d = usedHeader + rowCurrent;

        //        double fontsize = 0;
        //        bool bold = false;
        //        string color = null;
        //        Int16 align = 0;
        //        string background = null;
        //        bool width = false;
        //        double height = 0;
        //        int[] cellposition = new int[2];
        //        if (markup.Contains(",font-size")) fontsize = Convert.ToDouble(Substr(markup, ",font-size", ","));
        //        if (markup.Contains(",font-bold")) bold = true;
        //        if (markup.Contains(",color")) color = Substr(markup, ",color", ",");
        //        if (markup.Contains(",cen")) align = 1;
        //        else if (markup.Contains(",right")) align = 2;
        //        if (markup.Contains(",bg")) background = Substr(markup, ",bg", ",");
        //        if (markup.Contains(",cell"))
        //        {
        //            string cl = Substr(markup.Replace("(", "").Replace(")", ""), ",cell", ",");
        //            string[] arryc = cl.Split(":");
        //            if (arryc.Length == 1)
        //                cellposition[0] = Convert.ToInt32(arryc[0]);

        //            else if (arryc.Length == 2)
        //            {
        //                cellposition[0] = Convert.ToInt32(arryc[0]);
        //                cellposition[1] = Convert.ToInt32(arryc[1]);
        //            }
        //        }
        //        if (markup.Contains(",w"))
        //        {
        //            ws.Column(c.Ordinal + 1).Width = Convert.ToDouble(Substr(markup, ",w", ","));
        //            width = true;//<--width---<<
        //        }
        //        if (markup.Contains(",height")) height = Convert.ToDouble(Substr(markup, ",height", ","));
        //        if (c.ColumnName.Contains("addimage"))
        //        {
        //            var impagepage = dt.Rows[0][c.Ordinal].ToString();
        //            impagepage = impagepage.Replace("/", @"\");
        //            string path = $"{Directory.GetCurrentDirectory()}{@"\wwwroot\" + impagepage }";
        //            if (markup != "")
        //            {
        //                markup = Substr(markup, ",", "");
        //                markup = markup.Replace("(", "").Replace(")", "");
        //                if (int.TryParse(markup, out int n))
        //                    ws.AddPicture(path).MoveTo(ws.Cell(rowCurrent_d + 1, markup).Address);
        //                else if (markup.Contains(","))
        //                {
        //                    string[] markupArray = markup.Split(",");
        //                    ws.AddPicture(path).MoveTo(ws.Cell(Convert.ToInt32(markupArray[0]), Convert.ToInt32(markupArray[1])).Address);
        //                }
        //                else
        //                    ws.AddPicture(path).MoveTo(ws.Cell(markup).Address);
        //            }
        //            else
        //                ws.AddPicture(path).MoveTo(ws.Cell(rowCurrent_d + 1, 1).Address);
        //            continue;
        //        } //<--- Add Image ----<<
        //        else if (dt.Rows[0][c.Ordinal].ToString() == "" && dt.Columns.Count == 1)
        //        {
        //            ws.Cell(rowCurrent_d + 1, c.Ordinal + 1).RichText.AddNewLine();
        //            continue;
        //        } //<--- New line ----<<

        //        for (Int16 i = 1; i <= rowCount; i++)
        //        {
        //            IXLCell cell = null;
        //            if (cellposition[0] > 0 && cellposition[1] > 0)
        //                cell = ws.Cell(cellposition[0], cellposition[1]);

        //            else if (cellposition[0] > 0)
        //                cell = ws.Cell(cellposition[0], c.Ordinal + 1);

        //            else
        //                cell = ws.Cell(rowCurrent_d + i, c.Ordinal + 1);

        //            string inline = dt.Rows[i - 1][c.Ordinal].ToString();
        //            string inlinemarkup = "";
        //            cell.Value = Substr(inline, "", "^");

        //            if (inline.Contains("^"))
        //                inlinemarkup = Substr(inline, "^", "");

        //            if (markup != "")
        //            {
        //                if (fontsize > 0) cell.Style.Font.FontSize = fontsize;
        //                if (bold) cell.Style.Font.SetBold();
        //                if (width == true) cell.Style.Alignment.WrapText = true;
        //                if (color != null) cell.Style.Font.FontColor = XLColor.FromHtml(color);
        //                if (align == 1) cell.Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
        //                else if (align == 2) cell.Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
        //                if (background != null) cell.Style.Fill.BackgroundColor = XLColor.FromHtml(background);
        //                if (height > 0) ws.Row(rowCurrent_d + i).Height = height;

        //                //if (mergedcols > 0)
        //                //{
        //                //    if (inlinemarkup.Contains(",mergedc"))
        //                //        ws.Range(rowCurrent_d + i, c.Ordinal + 1, rowCurrent_d + i, mergedcols).Merge();
        //                //}

        //                if (markup.Contains(",bd"))
        //                {
        //                    string useStylebyData = inlinemarkup;
        //                    CreateAdvancedExcFm_border(_ws: cell, style: markup, IsHeader: "0", useStylebyData: useStylebyData);
        //                }

        //                //<------ Inline Markup ----------<<
        //                if (inlinemarkup != "")
        //                {
        //                    if (inlinemarkup.Contains(",bg#"))
        //                        cell.Style.Fill.BackgroundColor = XLColor.FromHtml(Substr(inlinemarkup, ",bg", ","));
        //                    if (inlinemarkup.Contains(",height"))
        //                        ws.Row(rowCurrent_d + i).Height = Convert.ToDouble(Substr(inlinemarkup, ",height", ","));
        //                    if (inlinemarkup.Contains(",right"))
        //                        cell.Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
        //                    if (inlinemarkup.Contains(",merged"))
        //                    {
        //                        string[] to_array = Substr(
        //                         word: inlinemarkup.Replace("(", "").Replace(")", ""),
        //                         startAs: ",merged",
        //                         endAs: ",").Split(',');

        //                        int addi_to_row = 0;
        //                        int addi_to_col = 0;
        //                        if (to_array[0] == "lastcol")
        //                            addi_to_col = Convert.ToInt32(dt.Columns.Count) - Convert.ToInt32(c.Ordinal) - 1;
        //                        else
        //                            addi_to_col = Convert.ToInt16(to_array[0]);

        //                        if (to_array.Length == 2) addi_to_row = Convert.ToInt16(to_array[1]);

        //                        int from_row = rowCurrent_d + i;
        //                        int from_col = c.Ordinal + 1;
        //                        int to_row = rowCurrent_d + i + addi_to_row;
        //                        int to_col = c.Ordinal + 1 + addi_to_col;
        //                        ws.Range(from_row, from_col, to_row, to_col).Merge();
        //                    }
        //                }

        //                //<---- Last Row ----<<
        //                if (i == rowCount)
        //                {
        //                    if (markup.Contains(",bd")) CreateAdvancedExcFm_border(_ws: cell, style: markup, IsHeader: "", useStylebyData: "", lastRow: true);
        //                    //if (markup.Contains(",mergedrows"))
        //                    //{
        //                    //    Int16 mergedPer_rows = System.Convert.ToInt16(Substr(markup, ",mergedrows", ","));
        //                    //    Double iterate_Nm = Math.Floor(rowCount / (double)mergedPer_rows);
        //                    //    Int32 mergedPer_Fm;
        //                    //    Int32 mergedPer_To;
        //                    //    for (var a = 1; a <= iterate_Nm; a++)
        //                    //    {
        //                    //        mergedPer_Fm = (mergedPer_rows * a) - mergedPer_rows + 1 + rowCurrent_d;
        //                    //        mergedPer_To = (mergedPer_rows * a) + rowCurrent_d;
        //                    //        ws.Range(mergedPer_Fm, c.Ordinal + 1, mergedPer_To, c.Ordinal + 1).Merge();
        //                    //        ws.Cell(mergedPer_Fm + 1, c.Ordinal + 1).Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
        //                    //    }
        //                    //}
        //                    //else if (markup.Contains(",mergedto"))
        //                    //{
        //                    //    int n = 0;
        //                    //    int maxn = 0;
        //                    //    List<int> Lists = new List<int>();
        //                    //    foreach (DataRow dtRow in dt.Rows)
        //                    //    {
        //                    //        n += 1;
        //                    //        if (dtRow[c.Ordinal].ToString().Contains(",mergedto"))
        //                    //            Lists.Add(n + rowCurrent_d);
        //                    //    }

        //                    //    maxn = Lists.Count - 1;
        //                    //    n = 0;
        //                    //    foreach (int item in Lists)
        //                    //    {
        //                    //        n += 1;
        //                    //        if (n <= maxn)
        //                    //        {
        //                    //            if (Lists[n] - item > 1)
        //                    //                ws.Range(item, c.Ordinal + 1, Lists[n] - 1, c.Ordinal + 1).Merge();
        //                    //        }
        //                    //        else if (Lists[maxn] - item > 1)
        //                    //            ws.Range(item, c.Ordinal + 1, n + rowCurrent_d, c.Ordinal + 1).Merge();
        //                    //    }
        //                    //}
        //                }
        //            }
        //        }
        //    }
        //}
        //private static DataTable CreateAdvancedExcFm_applyStylebyfirstCol(DataTable dt)
        //{
        //    string font_size = "";
        //    string font_bold = "";
        //    string color = "";
        //    string bg = "";
        //    string bd = "";
        //    string align = "";
        //    string hdfont_size = "";
        //    string hdfont_bold = "";
        //    string hdcolor = "";
        //    string hdbg = "";
        //    string hdbd = "";
        //    string hdalign = "";

        //    foreach (DataColumn c in dt.Columns)
        //    {
        //        string markup = Substr(c.ColumnName, "^", "");
        //        if (c.Ordinal == 0)
        //        {
        //            if (markup.Contains(",font-size"))
        //                font_size = ",font-size" + Substr(markup, ",font-size", ",");
        //            if (markup.Contains(",font-bold"))
        //                font_bold = ",font-bold" + Substr(markup, ",font-bold", ",");
        //            if (markup.Contains(",color#"))
        //                color = ",color" + Substr(markup, ",color", ",");
        //            if (markup.Contains(",bg#"))
        //                bg = ",bg" + Substr(markup, ",bg", ",");
        //            if (markup.Contains(",bd"))
        //                bd = ",bd" + Substr(markup, ",bd", ",");
        //            if (markup.Contains(",cen"))
        //                align = ",cen";
        //            else if (markup.Contains(",right"))
        //                align = ",right";

        //            if (markup.Contains(",hdfont-size"))
        //                hdfont_size = ",hdfont-size" + Substr(markup, ",hdfont-size", ",");
        //            if (markup.Contains(",hdfont-bold"))
        //                hdfont_bold = ",hdfont-bold" + Substr(markup, ",hdfont-bold", ",");
        //            if (markup.Contains(",hdcolor#"))
        //                hdcolor = ",hdcolor" + Substr(markup, ",hdcolor", ",");
        //            if (markup.Contains(",hdbg#"))
        //                hdbg = ",hdbg" + Substr(markup, ",hdbg", ",");
        //            if (markup.Contains(",hdbd"))
        //                hdbd = ",hdbd" + Substr(markup, ",hdbd", ",");
        //            if (markup.Contains(",hdcen"))
        //                hdalign = ",hdcen";
        //            else if (markup.Contains(",hdright"))
        //                hdalign = ",hdright";
        //        }
        //        else
        //        {
        //            if (!c.ColumnName.Contains("^"))
        //                c.ColumnName += "^";
        //            if (!markup.Contains(",font-size") & font_size != "")
        //                c.ColumnName += font_size;
        //            if (!markup.Contains(",font-bold") & font_bold != "")
        //                c.ColumnName += font_bold;
        //            if (!markup.Contains(",color") & color != "")
        //                c.ColumnName += color;
        //            if (!markup.Contains(",bg") & bg != "")
        //                c.ColumnName += bg;
        //            if (!markup.Contains(",bd") & bd != "")
        //                c.ColumnName += bd;
        //            if (!(markup.Contains(",cen") | markup.Contains(",rigth")) & align != "")
        //                c.ColumnName += align;


        //            if (!markup.Contains(",hdfont-size") & hdfont_size != "")
        //                c.ColumnName += hdfont_size;
        //            if (!markup.Contains(",hdfont-bold") & hdfont_bold != "")
        //                c.ColumnName += hdfont_bold;
        //            if (!markup.Contains(",hdcolor#") & hdcolor != "")
        //                c.ColumnName += hdcolor;
        //            if (!markup.Contains(",hdbg#") & hdbg != "")
        //                c.ColumnName += hdbg;
        //            if (!markup.Contains(",hdbd") & hdbd != "")
        //                c.ColumnName += hdbd;
        //            if (!(markup.Contains(",hdcen") | markup.Contains(",hdrigth")) & hdalign != "")
        //                c.ColumnName += hdalign;
        //        }
        //    }
        //    return dt;
        //}
        //private static void CreateAdvancedExcFm_border(IXLCell _ws, string style, string IsHeader = "0", string useStylebyData = "", bool lastRow = false)
        //{
        //    string _style;
        //    if (IsHeader == "0")
        //        IsHeader = ",";
        //    else
        //        IsHeader = ",hd";

        //    if (useStylebyData.Contains(",bd("))
        //    {
        //        string str = Substr(useStylebyData, ",bd(", ")");
        //        string[] arrystr = str.Split(",");
        //        if (arrystr.Length == 1)
        //            CreateAdvancedExcFm_border_per_side(_ws, arrystr[0], arrystr[0], arrystr[0], arrystr[0]);

        //        else if (arrystr.Length == 2)
        //            CreateAdvancedExcFm_border_per_side(_ws, arrystr[0], arrystr[1], arrystr[0], arrystr[1]);

        //        else if (arrystr.Length == 4)
        //            CreateAdvancedExcFm_border_per_side(_ws, arrystr[0], arrystr[1], arrystr[2], arrystr[3]);


        //    }
        //    else if (style.Contains(IsHeader + "bd"))
        //    {
        //        if (style.Contains(IsHeader + "bd-color"))
        //            _style = Substr(style, IsHeader + "bd-color", ",");
        //        else
        //            _style = "#313131";


        //        if (useStylebyData.Contains("bdtop#"))
        //            _ws.Style.Border.TopBorderColor = XLColor.FromHtml(Substr(useStylebyData, "bdtop", ","));


        //        if (useStylebyData.Contains("bdleft#"))
        //            _ws.Style.Border.TopBorderColor = XLColor.FromHtml(Substr(useStylebyData, "bdleft", ","));
        //        else
        //        {
        //            _ws.Style.Border.TopBorderColor = XLColor.FromHtml(_style);
        //            _ws.Style.Border.LeftBorderColor = XLColor.FromHtml(_style);
        //            _ws.Style.Border.RightBorderColor = XLColor.FromHtml(_style);
        //        }



        //        if (style == IsHeader + "bd-medium")
        //        {
        //            _ws.Style.Border.LeftBorder = XLBorderStyleValues.Medium;
        //            _ws.Style.Border.TopBorder = XLBorderStyleValues.Medium;
        //            _ws.Style.Border.RightBorder = XLBorderStyleValues.Medium;
        //        }
        //        else if (style.Contains(IsHeader + "bd-double"))
        //        {
        //            _ws.Style.Border.LeftBorder = XLBorderStyleValues.Double;
        //            _ws.Style.Border.TopBorder = XLBorderStyleValues.Double;
        //            _ws.Style.Border.RightBorder = XLBorderStyleValues.Double;
        //        }
        //        else if (style.Contains(IsHeader + "bd-dashed"))
        //        {
        //            _ws.Style.Border.LeftBorder = XLBorderStyleValues.Dashed;
        //            _ws.Style.Border.TopBorder = XLBorderStyleValues.Dashed;
        //            _ws.Style.Border.RightBorder = XLBorderStyleValues.Dashed;
        //        }
        //        else
        //        {
        //            _ws.Style.Border.LeftBorder = XLBorderStyleValues.Thin;
        //            _ws.Style.Border.TopBorder = XLBorderStyleValues.Thin;
        //            _ws.Style.Border.RightBorder = XLBorderStyleValues.Thin;
        //        }

        //        if (lastRow == true)
        //        {
        //            _ws.Style.Border.BottomBorderColor = XLColor.FromHtml(_style);
        //            _ws.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
        //        }
        //    }

        //}
        //private static void CreateAdvancedExcFm_border_per_side(IXLCell cell, string top, string right, string bottom, string left)
        //{
        //    cell.Style.Border.TopBorderColor = XLColor.FromHtml(top);
        //    cell.Style.Border.RightBorderColor = XLColor.FromHtml(right);
        //    cell.Style.Border.BottomBorderColor = XLColor.FromHtml(bottom);
        //    cell.Style.Border.LeftBorderColor = XLColor.FromHtml(left);

        //    cell.Style.Border.TopBorder = XLBorderStyleValues.Thin;
        //    cell.Style.Border.RightBorder = XLBorderStyleValues.Thin;
        //    cell.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
        //    cell.Style.Border.LeftBorder = XLBorderStyleValues.Thin;
        //}
        public static string Substr(string word, string startAs = "", string endAs = "")
        {
            if (startAs == "" & endAs == "")
                return word;
            else if (startAs != "" & endAs == "")
            {
                if (word.IndexOf(startAs) > -1)
                    return word.Substring(word.IndexOf(startAs) + startAs.Length);
            }
            else if (startAs == "" & endAs != "")
            {
                if (word.IndexOf(endAs) > -1)
                    return word.Substring(0, word.IndexOf(endAs));
            }
            else if (word.IndexOf(startAs) > -1)
            {
                word = word.Substring(word.IndexOf(startAs) + startAs.Length);
                if (word.IndexOf(endAs) > -1)
                    return word.Substring(0, word.IndexOf(endAs));
            }
            return word;
        }
        //public static DataTable AdjustExternalDT(string conn, DataTable ExternalDT, string UsTypeNm = null, bool convertAllColsToStr = false)
        //{
        //    //<-- UsTypeNm = User Defined Table type --<<
        //    if (UsTypeNm == null) return ExternalDT;
        //    if (ExternalDT == null || ExternalDT.Rows.Count == 0) return ExternalDT;
        //    (string name, int orderby)[] UsTypeCols = null;

        //    List<P> args = new List<P>
        //    {
        //        new P { Key = "url", Value = "dbo.sqlservices" },
        //        new P { Key = "if", Value = "Get_table_types_columns" },
        //        new P { Key = "TableName", Value = UsTypeNm }
        //    };
        //    DataSet _UsTypeCols = CallSP(conn, args);
        //    DataColumn[] ExternalCols = null;

        //    if (_UsTypeCols.Tables[0].Rows.Count == 0)
        //        return ExternalDT;

        //    UsTypeCols = _UsTypeCols.Tables[0].Rows.OfType<DataRow>()
        //        .Select(k => (k[0].ToString().ToUpper(), (int)k[1])).ToArray();

        //    ExternalCols = ExternalDT.Columns.OfType<DataColumn>().ToArray();

        //    //<-- Remove External columns is not exists in User Defined Table type's columns -----<<
        //    foreach (var Col in ExternalCols)
        //    {
        //        if (!Array.Exists(UsTypeCols, us => us.name == Col.ToString().ToUpper()))
        //            ExternalDT.Columns.Remove(Col);
        //    }

        //    // <--- Add missing columns to External columns ,According to User Defined Table type's columns -------<<
        //    foreach (var (name, orderby) in UsTypeCols)
        //    {


        //        if (!Array.Exists(ExternalCols, ex => ex.ToString().ToUpper() == name))
        //        {
        //            if (name == "ID")
        //            {
        //                DataColumn IdentityCol = new DataColumn
        //                {
        //                    DataType = System.Type.GetType("System.Int32"),
        //                    ColumnName = name,
        //                };
        //                ExternalDT.Columns.Add(IdentityCol);
        //                // IdentityCol.SetOrdinal(1);

        //                for (int i = 0; i < ExternalDT.Rows.Count; i++)
        //                {
        //                    ExternalDT.Rows[i][name] = i + 1;
        //                }
        //            }
        //            else
        //            {
        //                //     DataColumn dc = ExternalDT.Columns.Add(Col)
        //                DataColumn dc = new DataColumn
        //                {
        //                    DataType = System.Type.GetType("System.String"),
        //                    ColumnName = name,
        //                };
        //                ExternalDT.Columns.Add(dc);
        //            }
        //        }
        //    }

        //    //< --- Sort External columns according to User Defined Table type's columns -------<<
        //    foreach (var (name, orderby) in UsTypeCols)
        //    {
        //        ExternalDT.Columns[name].SetOrdinal(orderby - 1);
        //    }

        //    //<---- Convert all External columns's type to string (!!Alternative) ---<<
        //    if (convertAllColsToStr == true)
        //    {
        //        DataTable ExternalStrDT = ExternalDT.Clone();
        //        foreach (DataColumn dc in ExternalStrDT.Columns) dc.DataType = typeof(string);
        //        foreach (DataRow row in ExternalDT.Rows) ExternalStrDT.ImportRow(row);
        //        return ExternalStrDT;
        //    }
        //    else
        //        return ExternalDT;

        //}
        //private static DataTable ShortQuery(string conn, string Select, string Form = null, string Where = null, Int16 AllowNull = 0)
        //{
        //    DataTable dt = new DataTable();
        //    SqlConnection connection = new SqlConnection(conn);
        //    SqlCommand cmd = new SqlCommand()
        //    {
        //        CommandType = CommandType.StoredProcedure,
        //        CommandText = "oak.sqlservices",
        //        Connection = connection
        //    };
        //    cmd.Parameters.Add("@If", SqlDbType.VarChar).Value = "SHORTQUERY";
        //    cmd.Parameters.Add("@Select", SqlDbType.VarChar).Value = Select;
        //    cmd.Parameters.Add("@Form", SqlDbType.VarChar).Value = Form;
        //    cmd.Parameters.Add("@Where01", SqlDbType.VarChar).Value = Where;
        //    try
        //    {
        //        SqlDataAdapter da = new SqlDataAdapter(cmd);
        //        da.Fill(dt);
        //    }

        //    catch (Exception ex) { throw ex; }
        //    finally { connection.Close(); }
        //    return dt;
        //    //  DsToJson(dt)

        //}
        //public static List<P> JsonToSPparams_Filter(string conn, string jsonstr)
        //{
        //    List<P> args = JsonToSPparams(jsonstr);
        //    List<P> argsOutput = new List<P>();
        //    string spName = args.Find(item => item.Key == "url").Value;
        //    DataTable dt = ShortQuery(conn, "SELECT lower(replace(name,'@','')) as name from sys.parameters where object_id =object_id('" + spName + "')");

        //    if (dt.Rows.Count > 0)
        //    {
        //        var UsTypeCols = dt.Rows.OfType<DataRow>().Select(k => k[0].ToString().ToUpper()).ToArray();
        //        foreach (var p in args)
        //        {
        //            if (Array.Exists(UsTypeCols, us => us == p.Key.ToUpper()))
        //                argsOutput.Add(p);
        //        }
        //        argsOutput.Add(new P { Key = "url", Value = spName });
        //        return argsOutput;
        //    }
        //    else
        //        return args;
        //}
        public static Dictionary<string, string> JsonToDictionary(string jsonstring)
        {
            if (jsonstring is null)
            {
                return null;
            }
            return JsonConvert.DeserializeObject<Dictionary<string, string>>(jsonstring);
        }
        public static string AddItemToJsonString(string jsonstring, string key, string value)
        {
            jsonstring = jsonstring.Remove(jsonstring.Length - 1);
            jsonstring += @",""" + key + @""":""" + value + @"""}";
            return jsonstring;
        }
        public static string GetLocalIPAddress()
        {
            var host = Dns.GetHostEntry(Dns.GetHostName());
            foreach (var ip in host.AddressList)
            {
                if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                    return ip.ToString();

            }
            return null;
        }
        public static bool IsIPAddress(string ipString)
        {
            if (String.IsNullOrWhiteSpace(ipString)) return false;

            string[] splitValues = ipString.Split('.');

            if (splitValues.Length != 4) return false;

            return splitValues.All(r => byte.TryParse(r, out byte tempForParsing));
        }
        public async static Task<object> DsToJsonFile(DataSet ds, string savepath)
        {

            TextWriter writer;
            string jsonstr = DsToJson(ds);

            if (!Directory.Exists(savepath)) Directory.CreateDirectory(savepath);

            using (writer = new StreamWriter(savepath, append: false))
            {
                await writer.WriteAsync(jsonstr);
            }

            return new { dd = "" };

        }
        public static class ContentTypes
        {
            public const string json = "application/json";
            public const string octet = "application/octet-stream";
            public const string javascript = "application/javascript";
            public const string ogg = "application/ogg";
            public const string pdf = "application/pdf";
            public const string xhtml = "application/xhtml+xml";
            public const string xml = "application/xml";
            public const string zip = "application/zip";
            public const string urlencoded = "application/x-www-form-urlencoded ";
            public const string textHtml = "text/html";
        }
        public class ReponseMultipleType
        {
            public string json;
            public MemoryStream memoryStream;
            public string errorMessage = null;
            public HttpStatusCode? statusCode = null;
        }
        /// <summary>
        /// Provide HttpWebRequest like jquery Ajax but the request will be sent from SERVER. 
        /// </summary>
        /// <param name="url">URL Destination</param>
        /// <param name="method">use WebRequestMethods.Http.Post or GET or else..</param>
        /// <param name="parametors"></param>
        /// <param name="headers">use new WebHeaderCollection{["Authorization"] = Request.Headers["Authorization"]};</param>
        /// <returns></returns>
        public static AjaxReponse Ajax(Action<AjaxParameter> action)
        {
            AjaxParameter model = new AjaxParameter();
            action.Invoke(obj: model);

            if (model.ContentType == null && model.method == HttpMethod.Get)
                model.ContentType = ContentTypes.json;
            else if (model.ContentType == null && model.method == HttpMethod.Post)
                model.ContentType = ContentTypes.urlencoded;

            AjaxReponse ReponseMultipleType = new AjaxReponse();

            try
            {
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                ServicePointManager.ServerCertificateValidationCallback = ((sender, certificate, chain, sslPolicyErrors) => true);
                HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(model.url);
                HttpWebResponse httpWebResponse = null;
                try
                {
                    byte[] bytes;
                    bytes = Encoding.ASCII.GetBytes(model.parametors);
                    httpWebRequest.Method = model.method.ToString();
                    httpWebRequest.ContentLength = bytes.Length;
                    httpWebRequest.ContentType = model.ContentType;
                    httpWebRequest.KeepAlive = false;

                    if (model.headers != null)
                        httpWebRequest.Headers = model.headers;

                    if (model.parametors != "")
                        using (Stream requestStream = httpWebRequest.GetRequestStream())
                        {
                            requestStream.Write(bytes, 0, bytes.Length);
                            requestStream.Close();
                        }

                    httpWebResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                    ReponseMultipleType.statusCode = httpWebResponse.StatusCode;

                    using (Stream responseStream = httpWebResponse.GetResponseStream())
                    {
                        using StreamReader reader = new StreamReader(responseStream);
                        ReponseMultipleType.json = reader.ReadToEnd();
                    }

                    httpWebResponse.Close();
                }
                catch (WebException we)
                {
                    ReponseMultipleType.errorMessage = we.Status + " " + we.Message;// + " " +( we.InnerException == null ? "" : we.InnerException);
                    return ReponseMultipleType;
                }
                finally
                {
                    httpWebResponse.Close();
                    httpWebResponse = null;
                    httpWebRequest = null;
                }
                return ReponseMultipleType;
            }
            catch (Exception ex)
            {
                ReponseMultipleType.errorMessage = ex.Message + " " + ex.InnerException;
                return ReponseMultipleType;
            }
        }
        public static async Task<ReponseMultipleType> AjaxFileAsync(string url, HttpMethod method, string parametors = "", WebHeaderCollection headers = null)
        {
            var ReponseMultipleType = new ReponseMultipleType();
            try
            {
                MemoryStream memory = new MemoryStream();
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                ServicePointManager.ServerCertificateValidationCallback = ((sender, certificate, chain, sslPolicyErrors) => true);

                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(url);
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(ContentTypes.json));

                    if (headers != null)
                        foreach (string key in headers.AllKeys)
                        {
                            client.DefaultRequestHeaders.Add(key, headers[key]);
                        };


                    HttpRequestMessage request = new HttpRequestMessage(method, url)
                    {
                        Content = new StringContent(parametors, Encoding.UTF8, ContentTypes.json)
                    };

                    using (HttpResponseMessage response = client.SendAsync(request).Result)
                    {
                        ReponseMultipleType.statusCode = response.StatusCode;
                        using (HttpContent content = response.Content)
                        {
                            if (response.Content.Headers.ContentType.MediaType.IndexOf(ContentTypes.json) > -1)
                                ReponseMultipleType.json = content.ReadAsStringAsync().Result;
                            else
                            {
                                await content.CopyToAsync(memory);
                                memory.Position = 0;
                                ReponseMultipleType.memoryStream = memory;
                            }
                        }
                    }
                }
                return ReponseMultipleType;
            }
            catch (Exception ex)
            {

                ReponseMultipleType.errorMessage = ex.Message + " " + ex.InnerException;
                return ReponseMultipleType;
            }
        }

        public static async Task<DataSet> ExcelToDataSet(FileUpload model)
        {
            if (model.File == null || model.File.Length == 0)
                return null;

            Stream MemStream = new MemoryStream();
            await model.File.CopyToAsync(MemStream);
            MemStream.Position = 0;
            DataSet resultDataset = new DataSet();
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            try
            {
                using (var reader = ExcelReaderFactory.CreateReader(MemStream))
                {
                    resultDataset = reader.AsDataSet(new ExcelDataSetConfiguration()
                    {
                        ConfigureDataTable = (tableReader) => new ExcelDataTableConfiguration()
                        {
                            UseHeaderRow = true
                        }
                    });

                    if (string.IsNullOrEmpty(model.ExcelSheetName))
                        return resultDataset;

                    if (resultDataset.Tables.Contains(model.ExcelSheetName))
                    {
                        var newDataset = new DataSet();
                        newDataset.Tables.Add(resultDataset.Tables[model.ExcelSheetName].Copy());
                        return newDataset;
                    }
                    else
                        return null;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static DataTable StringAllColumns(DataTable datatable)
        {
            DataTable ExternalStrDT = datatable.Clone();
            foreach (DataColumn dc in ExternalStrDT.Columns) dc.DataType = typeof(string);
            foreach (DataRow row in datatable.Rows) ExternalStrDT.ImportRow(row);
            return ExternalStrDT;
        }

        private static readonly Random random = new Random();
        public static string RandomString(int length, bool onlynumber = false)
        {
            string chars = "";

            if (onlynumber) chars = "0123456789";
            else chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        public static string CalculateMD5Hash(string input)
        {
            // step 1, calculate MD5 hash from input
            using MD5 md5 = MD5.Create();
            byte[] inputBytes = Encoding.ASCII.GetBytes(input);
            byte[] hash = md5.ComputeHash(inputBytes);

            // step 2, convert byte array to hex string
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < hash.Length; i++)
            {
                sb.Append(hash[i].ToString("X2"));
            }
            return sb.ToString();
        }
        public static string ToQueryString(this object obj, bool LowerFirstCharacter = false)
        {
            var properties = from p in obj.GetType().GetProperties()
                             where p.GetValue(obj, null) != null
                             select (LowerFirstCharacter ? char.ToLowerInvariant(p.Name[0]) + p.Name.Substring(1) : p.Name)
                             + "="
                             + System.Web.HttpUtility.UrlEncode(p.GetValue(obj, null).ToString());

            return string.Join("&", properties.ToArray());
        }

        public static string ToJsonString(this object obj)
        {
            return System.Text.Json.JsonSerializer.Serialize(obj);
        }
    }
}
