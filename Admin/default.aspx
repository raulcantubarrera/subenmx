<%@ Page Title="" Language="C#" MasterPageFile="~/Admin/AdminMaster.master" AutoEventWireup="true" CodeFile="default.aspx.cs" Inherits="Admin_default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <title>Administrador</title>
    <style>
        #logoAdmin {
            bottom: 0;
            opacity: 0.5;
            position: absolute;
            right: 0;
        }
        #body {
            background-color: #eee;
            display: inherit;
            height: 100%;
            width: 100%;
            z-index: 1;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div id="body">
        <img src="/img/logo.png" id="logoAdmin" />
    </div>
</asp:Content>


