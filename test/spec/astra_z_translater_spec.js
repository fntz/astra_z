var c = function(m){console.log(m)};

describe("Translater", function() {

  it ("translate elements", function() {
    var z = "(div(div)(span#span1)(span.class1.class2(div#id1.class1)))";

    var t = Translater.translate(z);
    var e = t.element;

    expect(e.down('span')).toHaveId('span1');
    expect(e.down('span').next()).toHaveClass('class1');
    expect(e.down('span').next()).toHaveClass('class2');
    expect(e.down('span').next().down()).toHaveClass('class1');
    expect(e.down('span').next().down()).toHaveId('id1');
    expect(e.descendants().size()).toEqual(4);

  });

  it ("error when after `(` follow not tag", function() {
    var z = "(#)";
    expect(
      function() { Translater.translate(z) }
    ).toThrow();
  });

  it ("2 world", function() {
    var z = "(div div)";
    expect(
      function() { Translater.translate(z) }
    ).toThrow();
  });

  it ("unexpected class", function() {
    var z = "(div.#)";
    expect(
      function() { Translater.translate(z) }
    ).toThrow();
  }); 

  it ("unexpected id", function() {
    var z = "(div#@)";
    expect(
      function() { Translater.translate(z) }
    ).toThrow();
  }); 

  


});










