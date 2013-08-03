var c = function(m){console.log(m)};

describe("Translator", function() {

  it ("translate elements", function() {
    var z = "(div(div)(span#span1)(span.class1.class2(div#id1.class1)))";

    var t = Translator.translate(z);
    var e = t.element;

    expect(e.down('span')).toHaveId('span1');
    expect(e.down('span').next()).toHaveClass('class1');
    expect(e.down('span').next()).toHaveClass('class2');
    expect(e.down('span').next().down()).toHaveClass('class1');
    expect(e.down('span').next().down()).toHaveId('id1');
    expect(e.descendants().size()).toEqual(4);

  });

  it("translate with binded", function() {
    var z = "(div.class1~1(div.class3!1)(div.class2~1)(div.class4~2)(div.class5!2))",
        t = Translator.translate(z),
        b = t.binded,
        h = b.first();

    expect(b.size()).toEqual(2);
    expect(h.get("from")).toEqual(['class1', 'class2']);
    expect(h.get("to")).toEqual(['class3']);  

    var e = "(div.class1~1)";
    expect(
      function() { Translator.translate(e); }
    ).toThrow();  
  });

  it ("translate repeat and more", function() {
    var z = "(div(div.class1(*))*)",
        t = Translator.translate(z),
        e = t.element;    
    
    expect(e.down().readAttribute("data-more")).toEqual("1"); 
    expect(e.down().readAttribute("data-repeat")).toEqual("1");
  });

  it ("error when after `(` follow not tag", function() {
    var z = "(#)";
    expect(
      function() { Translator.translate(z) }
    ).toThrow();
  });

  it ("2 world", function() {
    var z = "(div div)";
    expect(
      function() { Translator.translate(z) }
    ).toThrow();
  });

  it ("unexpected class", function() {
    var z = "(div.#)";
    expect(
      function() { Translator.translate(z) }
    ).toThrow();
  }); 

  it ("unexpected id", function() {
    var z = "(div#@)";
    expect(
      function() { Translator.translate(z) }
    ).toThrow();
  }); 

});










