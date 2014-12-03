﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Admin/AdminMaster.master" AutoEventWireup="true" CodeFile="RoutesAdmin.aspx.cs" Inherits="Admin_RoutesAdmin" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <title>Administrador de Rutas</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!--<script src="jquery.js"></script>-->
     <script src="https://maps.googleapis.com/maps/api/js?sensor=false" type="text/javascript"></script>
    <script src="jquery-1.11.1.js" type="text/javascript"></script>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js"></script>
    <script src="scriptGeneral.js"></script>
    <link href="cssGeneral.css" rel="stylesheet" type="text/css"/>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div id="header">
        <img id="imgHeader" src="imgs/pin2.png" />
        <div style='float:right;'>
            <div class="btnNormal" id="btnNewRoute">Crear Ruta</div>
            <div class="btnNormal" id="btnEditRoute">Editar Ruta</div>
            <div class="btnNormal" id="btnCancelRoute">Cancelar</div>
        </div>
      </div>
    <div>
        <div id="divEditRoute" style="display:none;"><span>Elegir Ruta a Editar</span><select id="selEditRoute"></select></div>
        <ul id='ulNewRoute' style='display: none;'>
            <li>
                <span>Número de Ruta</span>
                <input type='text' id='NoRouteTxt' placeholder="218"/>
            </li>
            <li>
                <span>Nombre de Ruta</span>
                <input type='text' id='NameRouteTxt' placeholder="Rosita Azteca"/>
            </li>
            <li>
                <span>Color 1</span>
                <input type='text' id='color1Txt' placeholder="#FFFFFF"/>
            </li>
            <li>
                <span>Color 2</span>
                <input type='text' id='color2Txt' placeholder="#FFFFFF"/>
            </li>
            <li>
                <span>Color del Texto</span>
                <input type='text' id='colorTxt' placeholder="#FFFFFF"/>
            </li>
            <li>
                <div class="btnNormal" id="btnSaveNewRoute">Guardar</div>
            </li>
        </ul>
    </div>
	<div id="divEditMarkers" style="position:absolute;float:right;right:0;z-index:1;">
            Estado <input type="text" id="inRouteStatus" placeholder="No está lista"/>
		<ul id="ulList">
			<!--<li  name="li1">
				<div class="divLeft">
					<span  name="li1">1</span>
				</div>
				<div class="divRight">
					<div class="divDescription">Lugar 1</div>
					<div class="divLocation">coordenada 1.1,coordenada 1.2</div>
				</div>
			</li>
			<li  name="li2">
				<div class="divLeft">
					<span  name="li2">2</span>
				</div>
				<div class="divRight">
					<div class="divDescription">Lugar 2</div>
					<div class="divLocation">coordenada 2.1,coordenada 2.2</div>
				</div>
			</li>
			<li  name="li3">
				<div class="divLeft">
					<span name="li3">3</span>
				</div>
				<div class="divRight">
					<div class="divDescription">Lugar 3</div>
					<div class="divLocation">coordenada 3.1,coordenada 3.2</div>
				</div>
			</li>
			<li  name="li4">
				<div class="divLeft">
					<span  name="li4">4</span>
				</div>
				<div class="divRight">
					<div class="divDescription">Lugar 4</div>
					<div class="divLocation">coordenada 4.1,coordenada 4.2</div>
				</div>
			</li>
			<li  name="li5">
				<div class="divLeft">
					<span  name="li5">5</span>
				</div>
				<div class="divRight">
					<div class="divDescription">Lugar 5</div>
					<div class="divLocation">coordenada 5.1,coordenada 5.2</div>
				</div>
			</li>-->
		</ul>
	</div>
   
    <!--<select id="selRoutes" onchange="showRouteSel(this);">
        <option value="0">-Seleccionar Ruta-</option>
    </select>-->
    <div id="divSelRoutes">
        <div id="divRoutes">
            
        </div>
        <div id="divOpenRoutes" val="closed">Rutas >></div>
    </div>
    
    <div id="map_canvas"></div>
    <div id="ErrorMsg">Mapa cargado con &eacute;xito!</div>
     <div id="warnings_panel" style="width:100%;height:10%;text-align:center"></div>
</asp:Content>

