using System;
using System.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web;

/// <summary>
/// Summary description for adminLogin
/// </summary>
public class adminLogin
{
    private bool _log
    {
        set;
        get;
    }

    public bool log
    {
        get { return _log; }
    }

	public adminLogin(string usr, string pass, string page)
	{
        if (checkUsr(usr, pass,page))
        {
            HttpContext cont = HttpContext.Current;
            cont.Session["usr"] = usr;
            _log = true;
        }

        else
        {
            _log = false;
        }
	}
    private bool checkUsr(string usr,string pass,string page)
    {
        SqlConnection sqlConn = null;
        SqlDataReader sqlRead = null;

        try
        {
            bool resp = false;
            string conn = ConfigurationManager.ConnectionStrings["conn"].ToString();
            sqlConn = new SqlConnection(conn);
            SqlCommand sqlCom = new SqlCommand("spAdminCheckUsr", sqlConn);
            sqlCom.Parameters.Add("@usr",SqlDbType.NVarChar).Value = usr;
            sqlCom.Parameters.Add("@pass", SqlDbType.NVarChar).Value = pass;
            sqlCom.Parameters.Add("@page", SqlDbType.NVarChar).Value = page;
            sqlConn.Open();
            sqlCom.CommandType = CommandType.StoredProcedure;
            sqlRead = sqlCom.ExecuteReader();
            if (sqlRead.HasRows)
            {
                while (sqlRead.Read())
                {
                    if (sqlRead.GetInt32(0) == 1)
                        resp = true;
                    else
                        resp =  false;
                }
            }
            else
            {
                resp = false;
            }
            return resp;
           
        }
        catch (Exception ex)
        {
            return false;
        }
        finally
        {
            if (sqlConn != null) sqlConn.Close();

            if (sqlRead != null) sqlRead.Close();
        }
    }
}