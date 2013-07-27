

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

  it ("#isEmpty", function() {
    expect([1,2,3].isEmpty()).toEqual(false);
    expect([].isEmpty()).toEqual(true);
  });

  it ("#diff", function() {
    expect([1,2,3].diff([1])).toEqual([2,3]);
    expect([].diff([1])).toEqual([]);
  });
})

describe("Hash", function() {
  it ("#eachKey", function() {
    var hash = $H({a:1, b:2, c:3});
    var keys = [];
    hash.eachKey(function(key) {
      keys.push(key);
    });
    expect(['a', 'b', 'c']).toEqual(keys);
  });

  it ("#eachValue", function() {
    var hash = $H({a:1, b:2, c:3});
    var values = [];
    hash.eachValue(function(value) {
      values.push(value);
    });
    expect([1, 2, 3]).toEqual(values);
  });

  it ("#eachPair", function() {
    var hash = $H({a:1, b:2, c:3});
    var keys = [];
    var values = [];
    hash.eachPair(function(key, value) {
      keys.push(key);
      values.push(value);
    });
    expect([1, 2, 3]).toEqual(values);
    expect(['a', 'b', 'c']).toEqual(keys);
  });

  it ("#mergeWith", function() {
    var h1 = $H({a: 1, b: 2, c: 2});
    var func = function(v1, v2) { return v1 + v2;};
    var h2 = h1.mergeWith({a: 3, b: 4, c: 5, d: 9}, func);
    expect($H({'a': 4, 'b': 6, 'c': 7, 'd': 9})).toEqual(h2);
    /*TypeError when function not defined*/
    expect(function(){h1.mergeWith({});}).toThrow();
  });

  it ("#updateWith", function() {
    var h = $H({a: 1, b: 2, c: 2});
    var func = function(v1, v2) { return v1 + v2;};
    var z = $H({a: 1});
    var n = z.updateWith(z, function(v1, v2) {});
    expect(n).toEqual(z);

    
    h.updateWith({a: 3, b: 4, c: 5, d: 9}, func);
    expect($H({'a': 4, 'b': 6, 'c': 7, 'd': 9})).toEqual(h);
    
    expect(
      function() {
        h.updateWith({});
      }
    ).toThrow();
    
  });

  it ("#isEmpty", function() {
    expect($H({a:1}).isEmpty()).toEqual(false);
    expect($H({}).isEmpty()).toEqual(true);
  });
});