using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.IO;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Data;
using System.Configuration;

/// <summary>
/// Summary description for maping
/// </summary>
public class maping
{
	public maping()
	{
		//
		// TODO: Add constructor logic here
		//
    }
    public string getRouteMarkers(int idRoute)
    {
        string JSONReturn = "";
        SqlConnection sqlConn = null;
        SqlDataReader sqlRead = null;

        try
        {
            string conn = ConfigurationManager.ConnectionStrings["conn"].ToString();
            sqlConn = new SqlConnection(conn);
            SqlCommand sqlCom = new SqlCommand("SELECT * FROM Markers WHERE idRoute = @idRoute", sqlConn);
            sqlCom.Parameters.Add("@idRoute", SqlDbType.Int).Value = idRoute;
            sqlConn.Open();
            SqlDataAdapter da = new SqlDataAdapter(sqlCom);
            DataTable dt = new DataTable();
            da.Fill(dt);
            sqlConn.Close();

            List<Marker> list = new List<Marker>();

            if (dt.Rows.Count > 0)
            {
                foreach (DataRow r in dt.Rows)
                {
                    list.Add(new Marker()
                    {
                        LON = r["Lon"].ToString(),
                        LAT = r["Lat"].ToString(),
                        OBSERVATION = r["Observation"].ToString()
                    });
                }
                JSONReturn = new JavaScriptSerializer().Serialize(list);
            }
        }
        catch(Exception ex)
        {
            return ex.Message + " _ " + ex.StackTrace;
        }
        finally
        {
            if (sqlConn != null) sqlConn.Close();

            if (sqlRead != null) sqlRead.Close();
        }

        return JSONReturn;
    }
}
class Marker
{
    public string LON;
    public string LAT;
    public string OBSERVATION;
}