<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.10.2" name="proyectil_impresora" tilewidth="32" tileheight="32" tilecount="10" columns="5">
 <image source="proyectil_impresora.png" width="160" height="64"/>
 <tile id="0"><properties><property name="anim" value="vuelo"/><property name="loop" type="bool" value="true"/><property name="radio_colision" type="int" value="6"/><property name="gira" type="bool" value="true"/></properties><animation><frame tileid="0" duration="70"/><frame tileid="1" duration="70"/><frame tileid="2" duration="70"/><frame tileid="3" duration="70"/></animation></tile>
 <tile id="5"><properties><property name="anim" value="impacto"/><property name="loop" type="bool" value="false"/><property name="radio_colision" type="int" value="6"/><property name="gira" type="bool" value="true"/></properties><animation><frame tileid="5" duration="40"/><frame tileid="6" duration="50"/><frame tileid="7" duration="60"/><frame tileid="8" duration="70"/><frame tileid="9" duration="80"/></animation></tile>
</tileset>
