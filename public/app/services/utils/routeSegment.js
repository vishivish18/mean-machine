angular.module('app')
.service('segment', function($http,$window,$location){
    var svc = this
    

    var rootSegment = {};

    function Segment(name, params) {

        this.name = name;
        this.params = params;
        this.params.name = name;
        
    }

    Segment.prototype.constructor = Segment;

    Segment.prototype.extend = function(params) {
        
        for (p in this.params) {
            if (!params.hasOwnProperty(p))
                params[p] = this.params[p];
        }
        return params;
    }

    /* 
        var segment = new Segment('app', {
            'nav' : 'navHtml',            
            'footer' : 'footerHtml'
        })

        segment.nest('events', {
             'panel' : 'panelHtml',
             'subHeader' : 'subHeaderHtml'
        })

        =======>

        rootSegment.app = {
            'nav' : 'navHtml',            
            'footer' : 'footerHtml'            
        }

        rootSegment.app.events = {
            'nav' : 'navHtml',            
            'panel' : 'panelHtml',
            'subHeader' : 'subHeaderHtml'
            'footer' : 'footerHtml'                        
        }

     */

    Segment.prototype.nest = function(name, params) {              

        return createSegment(this.name + '.' + name, Segment.prototype.extend.call(this, params))
    }

    function fetchSegment(segmentName) {
        return rootSegment[segmentName]
    }

    function createSegment(name, params) {

        var segment = new Segment(name, params);
        rootSegment[name] = segment;
        
        return rootSegment[name].params;
    }

    /*

    segment('app.events')

    =====>

    rootSegment['app.events'] -> segment object which can be nested
    
    rootSegment['app.events'].nest('edit', { 'foo' : 'bar' })

    */

    function s(name, params) {
        
        if (!params)
            return fetchSegment(name);
        
        return createSegment(name, params);
    }

    return s;

})