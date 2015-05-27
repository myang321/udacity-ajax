
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street=$('#street').val();
    var city=$('#city').val();
    var addr=street+","+city;
    var img_tag='<img class="bgimg" src="https://maps.googleapis.com/maps/api/streetview?size=600x400&location='+addr+'">';
    $body.append(img_tag);
    $greeting.text('So you want to live at '+addr+'?');

    var nytime_query='http://api.nytimes.com/svc/search/v2/articlesearch.json?q='+city+'&sort=newest&api-key=38a59c8f1d508adb7fa5f437beea2149:4:72142033';
    $.getJSON(nytime_query,function(data){
        $nytHeaderElem.text('New York Times Articles about '+city);
        var articles=data.response.docs;
        for (var i=0;i<articles.length;i++){
            var art=articles[i];
            var a_tag='<a href="'+art.web_url+'"">'+art.headline.main+'</a>';
            var p_tag='<p>'+art.snippet+'</p>';
            var li_tag='<li class="article">'+a_tag+p_tag+'</li>';
            $nytElem.append(li_tag);
        }
    }).error(function(e){
        $nytHeaderElem.text("error happened");
    });


    var wikiTimeout=setTimeout(function(){
        $wikiElem.text("failed to get wiki pages");
    },3000);

    var wiki_query='http://en.wikipedia.org/w/api.php?action=opensearch&search='+city+'&format=json&callback=wikiCallback';
    $.ajax({url:wiki_query,dataType:"jsonp",
        success:function(reponse){
            var artList=reponse[1];
            for (var i=0;i<artList.length;i++){
                var art=artList[i];
                var a_tag='<a href="http://en.wikipedia.org/wiki/'+art+'">'+art+'</a>';
                var li_tag='<li>'+a_tag+'</a>';
                $wikiElem.append(li_tag);
            }
            clearTimeout(wikiTimeout);
        }
        });
    // YOUR CODE GOES HERE!

    return false;
};

$('#form-container').submit(loadData);
