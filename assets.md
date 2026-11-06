# Referencias Assets

Por el momento, la carpeta **Assets** contiene el favicon y las carpetas **fonts**, **images** y **tiles**.

Todos los elementos dentro de assets están creados en base a una **estética informática sombría pixel-art**, pues muchos de ellos parten de elementos básicos de la informática como pop-ups, CPUs, etc.... Algunos de ellos incluso se inspiran en otras referencias, series incluidas.

Los recursos gráficos propios (incluidos la fuente, el favicon y los tilesets) se generaron con Claude a partiendo de prompts de texto. En el caso del jugador y el enemigo Pop-up, a parte de un prompt también se usaron imagenes sacadas de la serie *Cyberpunk Edgerunners* como referencia. El mapa **Sala1.json** se creó en Tiled usando esos tilesets.

Por un lado, la primera contiene **la fuente del texto del proyecto**, la cual se usa en la escena **Credits**. Esta se hizo con la finalidad de tener una fuenta que unificase el texto del proyecto y que reflejase una estética informática pixel-art.

Por otro lado, la segunda contiene **todas las imagenes usadas actualmente en el proyecto**:
- En la carpeta **credits** está la hoja de sprites de los botones de la escena del mismo nombre, la cual fue diseñada usando Claude Sonnet 5.5.   
- En la carpeta **entities** tenemos dos carpetas **enemies** y **player**. En la primera tenemos solo la hoja de sprites del enemigo **Pop-up**, el único enemigo del GDD presente ya en el juego, diseñada usando Claude Opus 5.5 basandose en la serie *Cyberpunk Edgerunners*. En la segunda tenemos la hoja de sprites para el **jugador** mirando hacia la izquierda y otra para este mirando hacia la derecha, esto debido a que al hacer flip el diseño del jugador se alteraba. El diseño del jugador se basa en el de los personajes de la serie *Cyberpunk Edgerunners* D y Capri. Se uso Claude Opus 5.5 para crear ambas hojas.
- En la carpeta **hud** tenemos varios **elementos de la hud del juego**. Estos se han generado usando Claude Sonnet 5.5.
- En la carpeta **menu** tenemos la **hoja de sprites para los botones de la escena de MainMenu**. Estos se diseñaron usando Claude Sonnet 5.5.
- En la carpeta **weapons** tenemos los sprites detrás de las armas del juego diseñados todos ellos con Claude Opus 5.5. Por un lado, tenemos la carpeta **combat** que contiene **las hojas de sprites para cada arma del juego equipada**, pese a que varias de ellas aun no se hayan implementado en su totalidad. Por otro lado, la carpeta **objects** contiene **la hoja de sprites para cada una de las armas del juego en el suelo**. La carpeta **previews** contiene **la preview para cada una de las animaciones representadas en las dos primeras carpetas**. Por último, la carpeta **proyectiles** contiene **las hojas de sprites para los proyectiles de las armas a distancia del juego** (CommandUSB, PortablePrinter y Router).
- El archivo **favicon.svg** está en la raíz de **assets** y se utiliza como icono de la pestaña del navegador. Su diseño representa una pantalla de terminal con un prompt y efectos de glitch en los colores característicos de la web del juego.
- Por último, en la carpeta **tiles** están los recursos para construir las salas del juego. El archivo **Sala1.json**, exportado desde Tiled, define el mapa de la primera sala. En la subcarpeta **tiledsets** están las **imágenes que utiliza ese mapa**, diseñadas con Claude Opus 5.5.