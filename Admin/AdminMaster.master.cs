using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Admin_AdminMaster : System.Web.UI.MasterPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["usr"] == null)
        {
            Response.Redirect("Login.aspx?p=" + HttpContext.Current.Request.Url.AbsolutePath);
        }
        else
        {
            getAdminOptions();
        }
    }
    private void getAdminOptions()
    {
        SqlConnection sqlConn = null;
        SqlDataReader sqlRead = null;

        try
        {
            string lsHTML = "";
            string conn = ConfigurationManager.ConnectionStrings["conn"].ToString();
            sqlConn = new SqlConnection(conn);
            SqlCommand sqlCom = new SqlCommand("spAdminOptionsByUsr", sqlConn);
            sqlCom.Parameters.Add("@usr", SqlDbType.NVarChar).Value = Session["usr"];
            sqlConn.Open();
            sqlCom.CommandType = CommandType.StoredProcedure;
            sqlRead = sqlCom.ExecuteReader();
            if (sqlRead.HasRows)
            {
                while (sqlRead.Read())
                {
                    lsHTML += "<li link='" + sqlRead.GetString(1) + "'>" + sqlRead.GetString(0) + "</li>";
                }
                ulMenu.InnerHtml = lsHTML;
                Response.Write("<script>fnMenuEvents();</script>");
            }
            else
            {
                spanError.InnerText = "No tienes permisos para ver ninguna ninguna página";
            }
        }
        catch (Exception ex)
        {
            spanError.InnerText = "Error 1 - Admin: \n" + ex.Message + "\n\n" + ex.StackTrace;
        }
        finally
        {
            if (sqlConn != null) sqlConn.Close();

            if (sqlRead != null) sqlRead.Close();
        }
    }
}
