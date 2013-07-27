

describe("Delegatable", function() {
  it("delegate", function() {
    var C = Class.create(Delegatable, {
      initialize: function(arr) {
        this.arr = arr;
        this.delegate('arr', 'size', 'first', 'uniq');
      }
    });

    var z = new C([1,2,3,1]);

    expect(z.size()).toEqual(4);
    expect(z.first()).toEqual(1);
    expect(z.uniq()).toEqual([1,2,3]);
    expect(function(){z.last()}).toThrow();
  });

  it ("delegate with non method should throw error", function() {
    Class.create(Delegatable, {
        initialize: function(arr) {
          this.arr = arr;
          expect(
            function(){
              this.delegate('arr', 'length')
            }).toThrow();
        }
      });
  });

  it ("#delegate_alias", function() {
    var C = Class.create(Delegatable, {
      initialize: function(arr) {
        this.arr = arr;
        this.delegate_alias('arr', ['count'], ['size']);
      }
    });

    var z = new C([1,2,3]);

    expect(z.count()).toEqual(3);
  });

  it ("expection when as count not equal alias size", function() {
    Class.create(Delegatable, {
        initialize: function(arr) {
          this.arr = arr;
          expect(
            function(){
              this.delegate_alias('arr', ['count', 'first'], ['size']);
            }).toThrow();
        }
      });
  });
});

describe("String", function() {

  it ("#isWorld", function() {
    expect("world".isWorld()).toBe(true);
    expect("".isWorld()).toBe(false);
    expect("<world>".isWorld()).toBe(false);
  }); 

  it ("#exec", function() {
    
    expect(
      "a is $0, b is $1, again $0".exec('A', 'B')
    ).toEqual("a is A, b is B, again A");

    expect(
      "$0".exec("A")
    ).toEqual("A");

    /*
    //pending
    expect(
      "1: \$0".exec("A")
    ).toEqual("1: \$0");
    */

    expect(
      function() {
        "$1".exec("1")
    }).toThrow();

  });

});

describe("Array", function() {
  it ("#second", function() {
    expect([1,2,3].second()).toEqual(2);
  });

  it ("#empty", function() {
    expect([1,2,3].empty()).toEqual(false);
    expect([].empty()).toEqual(true);
  });
})