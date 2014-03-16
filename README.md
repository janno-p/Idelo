# Kasutajaliidesed (2014) #

## Labor 1: UI Prototüüp ##

*Labori kirjeldus on võetud aadressilt
[http://lambda.ee/wiki/UI_Protot%C3%BC%C3%BCp](http://lambda.ee/wiki/UI_Protot%C3%BC%C3%BCp), mille
materjalid on kasutatavad [GNU Free Documentation License 1.2](http://www.gnu.org/copyleft/fdl.html)
tingimustel.*

Praktikumi eesmärk on

  * Kasutajaliidese disaini harjutamine.
  * CSS-i ja javascripti kasutamise harjutamine.


### Sisukord ###

  1. [Hindamine](#hindamine)
  1. [Funktsionaalsus, mis peab olema realiseeritud](#funktsionaalsus)
  1. [Üldised nõudmised](#noudmised)
  1. [Tehnoloogilised nõuded](#tehnoloogia)
     1. [Andmed ja nende formaat](#andmed)
     1. [Html, css and javascript kasutamine](#kasutamine)
     1. [Stiilist](#stiilist)
  1. [Abiks esimese töö jaoks](#abiks)


### <a name="hindamine" />Hindamine ###

Hindamisel arvestatakse järgmisi aspekte, osa neist objektiivsed, osa subjektiivsed:

  * Õigeaegselt esitatud või ei: hilinenud tööde eest saab ainult 50% punktidest, esitamine on
    ikkagi kohustuslik.
  * Nõutava funktsionaalsuse olemasolu: puuduste eest miinuspunkte, väga paljude puuduste korral
    tööd ei arvestata (st tuleb edasi teha, kuni on piisavalt OK).
  * Kasutajaliidese lihtne arusaadavus ja mugavus.
  * Kasutajaliidese hea väljanägemine.
  * Täiendav omaleiutatud funktsionaalsus, huvitav tehnoloogia jne: annab lisapunkte.


### <a name="funktsionaalsus" />Funktsionaalsus, mis peab olema realiseeritud ###

*Oled Molvaania programmeerija, kellele on valitsus teinud ülesandeks kirjutada patriotismi
suurendav virtuaaltoimiku programm iDELO, mille abil on võimalik kaaskodanike ebapatriootlikke samme
kirja panna. Programm võimaldab vaadelda kaaskodanike informatsiooni ja julgeolekustruktuuridele
nende tegudest ette kanda.*

Kasutamine:

  * Registreerimine

    * Kasutajanimeks võtke e-posti aadress

  * Sisselogimine
  * Nimekiri - kodanikest kelle kohta on antud kasutaja kaebusi esitanud

    * Võimalus sortida
    * Võimalus vaadelda nimekirja sündmuste tüüpide kaupa

  * Konkreetse kodaniku vaade - kuvatakse ainult sisseloginud kasutaja kaebused
  * Julgeolekutöötaja vaade - kuvatakse kõik kodaniku kohta saadaolev info

    * Sündmuste tüüpide lisamine

  * Otsing

    * Lihtne otsing
    * Täpsem otsing

  * Kodanik:

    * Nimi
    * Sugu
    * Sünniaeg
    * Elukoht
    * Foto

  * Kaebus:

    * Episoodi pealkiri
    * Sündmuse tüüp (sildiloogikaga (tag))
    * Kellaeg
    * Asukoht kaardil
    * Detailne kirjeldus
    * Foto(d)


### <a name="noudmised" />Üldised nõudmised ###

Kirjeldatud rakenduse jaoks tuleb luua täielik kasutajaliidese prototüüp. Serverirakendust,
andmebaasi jne esimese labori jaoks ei kasutata. Samas peab olema rakendusel täielik kasutajaliides,
vormide, väljade, töötavate JavaScriptis kirjutatud vormiväljade kontrolli ja nuppudega.

Veateated peavad olema esitatud mõistlikult. See tähendab et nad peavad andma kasutajale tagasisidet
vea põhjustest, võimalikult mõistlikul moel. Javascripti `alert()` funktsioon on viga.

Rakenduse või veebilehe täpne sisu ja järjestused ei ole määratud. Tuleb ise loovust üles näidata.
Teiste tudengite lahenduste kopeerimine on keelatud.

Sinu leht peab töötama nii Firefoxi kui Internet Exploreriga.


### <a name="tehnoloogia" />Tehnoloogilised nõuded ###

Kasutajaliidese mõttes tuleb rakendus realiseerida puhtalt HTMLi, CSSi ja javascriptiga.

Flashi, Javat vms ei tohi kasutada.


#### <a name="andmed" />Andmed ja nende formaat ####

Andmed saab veebileht ainult javascriptiga *json* formaadis.

Serverilt saab lugeda ainult staatilist htmli/cssi/pilte ja *json* formaadis andmeid.

Vormiväljade omadused peavad olema antud html-atribuutidena ja neid kontrollitakse/kasutatakse js
abil, vaadates, mis atribuudid väljal on.

Staatiline html ainult igal juhul muutumatute elementide jaoks: päis, üldmenüü jms.

Iga otsingu tulemus on javascripti massiiv/struktuur, tulemus kuvatakse dünaamiliselt.


#### <a name="kasutamine" />Html, css and javascript kasutamine ####

Disain peab kasutama väga lihtsat html-i. Pealkirjad, lõigud, listid, lingid, pildid. Tabeleid
üksteise sisse asetada ei tohi, kuid vajadusel tabelielement lubatud. Kujundusliku info nagu rasvane
või kaldkiri, mõõtmete, värvide ja muu sellise määramine HTMLis on keelatud. Seda tuleb teha CSSi
tasemel.

Otsingu ja sisestusvormid peavad olema dünaamilised: andmed saadetakse serverile alles siis kui kogu
vajalik info otsingu/sisestusvomils on täidetud/valitud. See sisaldab ka dünaamilisi valikuid, puude
avamist-sulgemist, kohustuslike väljade kontrolle jne.

Kõigi liidese väljadele, mis pole iseenesestmõistetavad, tuleb lisada abiinfo. Ühe näitena:
[http://web-graphics.com/mtarchive/001717.php](http://web-graphics.com/mtarchive/001717.php)
Jälgige, et see kasutajakogemust ei segaks ega kasutajat ei häiriks.

Menüüd tuleb luua CSS/JavaScripti abil (see
[http://css.maxdesign.com.au/listamatic/](http://css.maxdesign.com.au/listamatic/)).

Soovitame tungivalt (kuid see pole rangelt kohustuslik) kasutada kas [JQuery](http://jquery.com/)
või [Prototype](http://www.prototypejs.org/) JavaScripti teeke. Esimese puhul on abiks ka
[Jquery UI](http://jqueryui.com/).


#### <a name="stiilist" />Stiilist ####

Stilistilisi vihjeid (soovime näha puhast, stiilset ja kaasaegset lehte) leiate alljärgnevatest
viidetest:

  * [current web style](http://www.webdesignfromscratch.com/current-style.cfm#centered)
  * [2.0 web style from 2006](http://mittermayr.wordpress.com/2006/02/03/20-culture/)


### <a name="abiks" />Abiks esimese töö jaoks ###

  * Google maps: [http://code.google.com/apis/maps/](http://code.google.com/apis/maps/)

Vormikontrolli näitefaile:

  * [html vorm sisuliste atribuutidega](http://lambda.ee/wiki/Html_vorm_sisuliste_atribuutidega)
  * [jupp sobivat javascripti atribuutide kasutuseks](http://lambda.ee/wiki/Jupp_sobivat_javascripti_atribuutide_kasutuseks)
