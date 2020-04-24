## [Programmierung und Design von WebApplications mit HTML5, CSS3 und JavaScript](https://lsf.uni-regensburg.de/qisserver/rds?state=verpublish&status=init&vmfile=no&publishid=148115&moduleCall=webInfo&publishConfFile=webInfo&publishSubDir=veranstaltung) ##

SS2020 

Leitung: Dr. Friedrich Wünsch, Louis Ritzkowski

# Projektname #

Flappy Bird 2.0

von Stefan Vocht (2120306)

### Beschreibung ###

Bei "Flappy Bird 2.0" handelt es sich um eine Erweiterung des Klassikers "Flappy Bird", in der sich die Hindernisse teils zusätzlich bewegen, wodurch das Spiel zu einer größeren Herausforderung wird als sein Vorgänger.

### Umsetzung ###

Das Spiel selbst verwendet nur JavaScript und findet auf einer HTML-Canvas statt. CSS wird aussschließlich für eine schönere Gestaltung der HTML-Seite benutzt.

### Steuerung (Falls Spiel) ###

Man startet das Spiel, indem man die Leertaste drückt. Im Spiel springt man ebenfalls mit Hilfe der Leertaste.

### Wichtige Klassen/Dateien ###

Der JavaScript-Code ist auf fünf Dateien verteilt: index.js, Game.js, Container.js, Obstacle.js und Pipes.js.

#### index.js ####
Die index.js wird am Ende der HTML-Seite aufgerufen, erstellt eine Instanz von der Klasse Game und initialisiert die EventListener der Seite.

#### Game.js ####
Die Game.js enthält zwei Klassen: Game und Obstacle_Selector.  
In Game laufen alle Stränge des Spiels zusammen, die Funktionen dieser Klasse kümmern sich um den richtigen Spielablauf, dh es gibt Methoden wie "start_game"
oder "gameloop".
Die Klasse Obstacle_Selector kümmert sich darum, welche Hindernisse als nächstes im Spiel auftauchen sollen.

#### Container.js ####
Die Container.js enthält folgende Klassen: Container, Image_Container, Background_Image_Handler, TextContainer und GameOverScreen.  
Container ist eine Basisklasse für alle Klasse, deren Elemente auf dem Bildschirm angezeigt werden sollen. Sie hat deshalb die Attribute x und y.  
Objekte der Klasse Image_Container sind für die Darstellung eines Bildes auf der Game-Canvas verantwortlich.  
In Background_Image_Handler wird das Hintergrundbild und dessen Bewegung im Spiel verwaltet.  
Mit Hilfe von TextContainer lässt sich ein Text auf der Canvas anzeigen.  
Eine Instanz von GameOverScreen kümmert sich um das GameOver-Menu, dass nach jedem Spiel zu sehen ist.

#### Obstacle.js ####
Die Obstacle.js enthält folgende Klassen: Abstract_Obstacle, Rect_Obstacle, Movable_Rect_Obstacle und Player.  
Abstract_Obstacle ist eine Art abstrakte Klasse, die vorgibt, welche Methoden Obstacle-Klassen besitzen müssen (z.B. collision()).  
Objekte von Rect_Obstacle sind im Spiel rechteckige Hindernisse.  
Objecte der Klasse Movable_Rect_Obstacle können sind rechteckige Hindernisse, die sich bewegen können.  
Die Klasse Player verwaltet die Darstellung und die Hitbox des Spielers.

#### Pipes.js ####
Die Pipes.js enthält folgende Klassen: Generell_Pipe, Normal_Pipe, Up_And_Down_Pipe, Corridor_Pipe, Closing_Pipe und Pipe_Part.  
Generell_Pipe ist das Grundgerüst für Normal_Pipe, Up_And_Down_Pipe, Corridor_Pipe und Closing_Pipe, und verwaltet die Rohrpaare im Spiel.
Objekte von Normal_Pipe sind die grünen Rohrpaare, die man bereits aus dem ursprünglichen Flappy Bird kennt.  
Up_And_Down_Pipe verwaltet ein blaues Rohrpaar, das sich ständig rauf und runter bewegt.
Corridor_Pipe verwaltet die gelben Rohrpaare, die einen längeren Korridor bilden, in dem der Spieler seine Höhe halten muss.  
Closing_Pipe verwaltet das Rohrpaar, bei dem die Farbe des oberen und unteren Rohrs ständig wechselt und bei dem das rote Rohr ab einer bestimmten
Nähe zum Spieler anfängt, sich in Richtung des anderen zu bewegen und so die Öffnung zu schließen.  
Pipe_Part kümmert sich um die einzelnen Rohre der Rohrpaare, wie sie gezeichnet werden und um ihre Hitbox.

### Designentscheidungen ###

Das Design sollte etwas mit dem Spiel zu tun haben, weshalb die meisten Elemente auf der Seite wie die Röhren aus dem Spiel geformt sind.
Um Einsteigern den Spielspaß nicht zu nehmen, gibt es außerdem unter dem Spielfenster ein Optionenmenu, in dem man zwischen drei Schwierigkeitsgraden
wählen kann.
