
describe("ProgressBar", function() {
  
  beforeEach(function() {
    pbar = new Element('div', {"id": "bar", "class": "progressbar"});
    $(document.body).insert(pbar);
  });

  afterEach(function() {
    pbar.remove();
    pbar = null;
  });

  it ("setting", function() {
    var z = new ProgressBar("bar");

    expect(Object.keys(z.setting).size()).toEqual(3);
  });

  it ("increment", function() {
    var z = new ProgressBar("bar");
    var w = z.bar.getWidth();
    z.increment();
    var nw = z.bar.getWidth();
    expect(nw > w).toEqual(true);    
  });

  it ("decrement", function() {
    var z = new ProgressBar("bar");
    var w = z.bar.getWidth();
    z.decrement();
    var nw = z.bar.getWidth();
    expect(nw < w).toEqual(true);    
  });

  it ("events", function() {
    var inc = 0, dec = 0;
    var foo = function(nw) { inc = nw; };
    var bar = function(nw) { dec = nw; };

    var z = new ProgressBar("bar", {on_increment: foo, on_decrement: bar});
    z.increment();
    z.decrement();

    expect(parseInt(inc) > 0).toEqual(true);
    expect(parseInt(dec) > 0).toEqual(true);
  });

});





