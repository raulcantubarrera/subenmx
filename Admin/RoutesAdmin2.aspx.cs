using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Serialization;
using System.IO;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Data;

public partial class Admin_RoutesAdmin2 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        fnCargarArchivos();
    }
    protected void fnCargarArchivos()
    {
        for (int i = 1; i < 17; i++)
        {
            string file = "C:/Users/USER/Documents/Visual Studio 2012/WebSites/subenMX/Routes/" + i + ".js";
            using (StreamReader r = new StreamReader(file))
            {
                string json = r.ReadToEnd();
                dynamic array = JsonConvert.DeserializeObject(json);
                //foreach (var item in array.objectList)
                //{
                    //Console.WriteLine(obj.address);
                    //string x = "d";
                //}
                foreach (var item in array)
                {
                    string x = item.Name.ToString();
                    switch (x)
                    {
                       /* case "origin":
                             string n = item.Value.ToString();
                            string locX = n.Split(',')[0].Replace("{","").Replace("\"","").Replace("Coordinates","").Replace("[","").Replace(":","").Trim();//\": [\r\n"),"");   // 25.693455,\r\n    -100.241806
                            string locY = n.Split(',')[1].Replace("}","").Replace("\"","").Replace("]","").Replace(":","").Trim();
                            //string des = item.description.ToString();
                            fnGuardarWayPoint(i,locX,locY,"Origen");
                            break;*/
                        case "observation":
                            string n = item.Value.ToString();
                            fnGuardarWayPoint2(i,n);
                            break;
                       /* case "waypoints":
                            string script =item.Value.ToString();
                            //var engine = new ScriptEngine();
                           // dynamic d = engine.CreateSession().Execute(script);
                           // dynamic array2 = JsonConvert.DeserializeObject(item.Value);
                            foreach (var item2 in item.Value)
                            {
                                string n2 = item2.location.ToString();
                                string locX2 = n2.Split(',')[0].Replace("{","").Replace("\"","").Replace("Coordinates","").Replace("[","").Replace(":","").Trim();//\": [\r\n"),"");   // 25.693455,\r\n    -100.241806
                                string locY2 = n2.Split(',')[1].Replace("}","").Replace("\"","").Replace("]","").Replace(":","").Trim();
                                string des2 = item2.description.ToString();
                                fnGuardarWayPoint(i,locX2,locY2,des2);
                            }
                            break;*/
                    }
                    //Console.WriteLine("{0} {1}", item.temp, item.vcc);
                }
            }
           
        }
    }
    protected void fnGuardarWayPoint(int id, string lon, string lat, string description)
    {
        SqlConnection sqlConn = null;
        SqlDataReader sqlRead = null;

        try
        {
            bool resp = false;
            string conn = ConfigurationManager.ConnectionStrings["conn"].ToString();
            sqlConn = new SqlConnection(conn);
            SqlCommand sqlCom = new SqlCommand("insert into Markers Values(@id,@lon ,@lat,@obs)", sqlConn);
            sqlCom.Parameters.Add("@id", SqlDbType.Int).Value = id;
            sqlCom.Parameters.Add("@lon", SqlDbType.Decimal).Value = lon;
            sqlCom.Parameters.Add("@lat", SqlDbType.Decimal).Value = lat;
            sqlCom.Parameters.Add("@obs", SqlDbType.NVarChar).Value = description;
            sqlConn.Open();
            //sqlCom.CommandType = CommandType.StoredProcedure;
            sqlRead = sqlCom.ExecuteReader();
            /*if (sqlRead.HasRows)
            {
                while (sqlRead.Read())
                {
                    if (sqlRead.GetInt32(0) == 1)
                        resp = true;
                    else
                        resp = false;
                }
            }
            else
            {
                resp = false;
            }*/
            //return resp;

        }
        catch (Exception ex)
        {
            //return false;
            Response.Redirect(ex.Message);
        }
        finally
        {
            if (sqlConn != null) sqlConn.Close();

            if (sqlRead != null) sqlRead.Close();
        }
    }
    protected void fnGuardarWayPoint2(int id, string desc)
    {
        SqlConnection sqlConn = null;
        SqlDataReader sqlRead = null;

        try
        {
            bool resp = false;
            string conn = ConfigurationManager.ConnectionStrings["conn"].ToString();
            sqlConn = new SqlConnection(conn);
            SqlCommand sqlCom = new SqlCommand("update  Routes Set Description = @desc where id = @id ", sqlConn);
            sqlCom.Parameters.Add("@desc", SqlDbType.NVarChar).Value = desc;
            sqlCom.Parameters.Add("@id", SqlDbType.Int).Value = id;
            sqlConn.Open();
            //sqlCom.CommandType = CommandType.StoredProcedure;
            sqlRead = sqlCom.ExecuteReader();
            /*if (sqlRead.HasRows)
            {
                while (sqlRead.Read())
                {
                    if (sqlRead.GetInt32(0) == 1)
                        resp = true;
                    else
                        resp = false;
                }
            }
            else
            {
                resp = false;
            }*/
            //return resp;

        }
        catch (Exception ex)
        {
            //return false;
            Response.Redirect(ex.Message);
        }
        finally
        {
            if (sqlConn != null) sqlConn.Close();

            if (sqlRead != null) sqlRead.Close();
        }
    }
    protected void fnCargarArchivos2()
    {
            string file = "C:/Users/USER/Documents/Visual Studio 2012/WebSites/subenMX/Admin/suben-export.js";
            using (StreamReader r = new StreamReader(file))
            {
                string json = r.ReadToEnd();
                dynamic array = JsonConvert.DeserializeObject(json);
                //foreach (var item in array.objectList)
                //{
                //Console.WriteLine(obj.address);
                //string x = "d";
                //}
                foreach (var item in array)
                {
                    string x = item.Name.ToString();
                    switch (x)
                    {
                        case "Buses":
                            string script = item.Value.ToString();
                            //var engine = new ScriptEngine();
                            // dynamic d = engine.CreateSession().Execute(script);
                            // dynamic array2 = JsonConvert.DeserializeObject(item.Value);
                            foreach (var item2 in item.Value)
                            {
                                string c1 = item2.Color1.ToString();
                                string c2 = item2.Color2.ToString();
                                string ct = item2.ColorTxt.ToString();
                                string w = item2.Way.ToString();
                                string n = item2.WayName.ToString();
                                string po = item2.PriceG.ToString();
                                string ps = item2.PriceS.ToString();
                               
                                fnGuardarBuses(c1,c2,ct,w,n,po,ps);
                            }
                            break;
                    }
                    //Console.WriteLine("{0} {1}", item.temp, item.vcc);
                }
            

        }
    }
    protected void fnGuardarBuses(string c1, string c2, string ct, string w,string n,string po,string ps)
    {
        SqlConnection sqlConn = null;
        SqlDataReader sqlRead = null;

        try
        {
            bool resp = false;
            string conn = ConfigurationManager.ConnectionStrings["conn"].ToString();
            sqlConn = new SqlConnection(conn);
            SqlCommand sqlCom = new SqlCommand("insert into Routes Values(@ci,@w,@n ,@po,@ps,@c1,@c2,@ct,@de,@s)", sqlConn);
            sqlCom.Parameters.Add("@ci", SqlDbType.Int).Value = 1;
            sqlCom.Parameters.Add("@c1", SqlDbType.VarChar).Value = c1.Replace("#","");
            sqlCom.Parameters.Add("@c2", SqlDbType.VarChar).Value = c2.Replace("#", "");
            sqlCom.Parameters.Add("@ct", SqlDbType.VarChar).Value = ct.Replace("#", "");
            sqlCom.Parameters.Add("@w", SqlDbType.Int).Value = int.Parse(w);
            sqlCom.Parameters.Add("@n", SqlDbType.NVarChar).Value = n;
            sqlCom.Parameters.Add("@po", SqlDbType.Decimal).Value = po;
            sqlCom.Parameters.Add("@ps", SqlDbType.Decimal).Value = ps;
            sqlCom.Parameters.Add("@de", SqlDbType.NVarChar).Value = "";
            sqlCom.Parameters.Add("@s", SqlDbType.Int).Value = 1;
            sqlConn.Open();
            //sqlCom.CommandType = CommandType.StoredProcedure;
            sqlRead = sqlCom.ExecuteReader();
            /*if (sqlRead.HasRows)
            {
                while (sqlRead.Read())
                {
                    if (sqlRead.GetInt32(0) == 1)
                        resp = true;
                    else
                        resp = false;
                }
            }
            else
            {
                resp = false;
            }*/
            //return resp;

        }
        catch (Exception ex)
        {
            //return false;
            Response.Redirect(ex.Message + ex.StackTrace);
        }
        finally
        {
            if (sqlConn != null) sqlConn.Close();

            if (sqlRead != null) sqlRead.Close();
        }
    }
}