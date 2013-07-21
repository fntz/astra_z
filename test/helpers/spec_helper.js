Element.addMethods({
    
    simulate: function(element, event_name, options) {
      var mouse_events = ['click', 'dblclick'];
      ['down', 'over', 'up', 'move', 'out'].each(function(z) { mouse_events.push('mouse'+z); });
      var html_events = $w('blur change error focus load resize select submit scroll unload');
      
      var event_type = mouse_events.include(event_name)? 'MouseEvents': 
                       html_events.include(event_name)?  'HTMLEvents' :
                       null;
      var base_setting = {
        bubbles       : true,
        cancelable    : true, 
        view          : window, 
        detail        : 0, 
        screenX       : 0, 
        screenY       : 0, 
        clientX       : 0, 
        clientY       : 0, 
        ctrlKey       : false, 
        altKey        : false, 
        shiftKey      : false, 
        metaKey       : false, 
        button        : 0, 
        relatedTarget : null    
      };

      if (!event_type )
        throw "#{event_name} not supported.".interpolate({'event_name': event_name}).capitalize();

      var element = $(element),
          new_event = null;
      Object.extend(base_setting, options || {});
      

      /*for O, S, F, C and IE>9*/
      if (!document.createEventObject) {

        new_event = document.createEvent(event_type);
        
        if (event_type == 'MouseEvents') {
          new_event.initMouseEvent = new_event.initMouseEvent.wrap(
            function(original) {
              return original.apply(this, 
                [event_name, $H(base_setting).values()].flatten())
            }
          );
          
          new_event.initMouseEvent()
        
        } else {
          
          new_event.initEvent(event_name, base_setting.bubbles, base_setting.cancelable);
        
        }  

        element.dispatchEvent(new_event);
      
      } else {
        
        new_event = document.createEventObject();
        Object.extend(new_event, base_setting);
        element.fireEvent('on' + event_name, new_event);
      
      }
    }  
  });

Element.addMethods({
  custom_show: function(element, options) {
    element.show();
  },
  custom_hide: function(element, options) {
    element.hide();
  }
});


function eventFire(element, type){
  if (element.fireEvent) {
    (element.fireEvent('on' + type));
  } else {
    var event = document.createEvent('MouseEvents');
    event.initEvent(type, true, false);
    element.dispatchEvent(event);
  }
}

