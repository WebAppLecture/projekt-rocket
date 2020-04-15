
/* 
Code, um aus mehreren Klassen gleichzeitig zu erben
Quelle: https://stackoverflow.com/questions/29879267/es6-class-multiple-inheritance
*/


export function allOf(BaseClass, ...Mixins) {

    function copyProperties(target, source) {
      const allPropertyNames = Object.getOwnPropertyNames(source).concat(Object.getOwnPropertySymbols(source))
  
      allPropertyNames.forEach((propertyName) => {
        if (propertyName.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
          return
        Object.defineProperty(target, propertyName, Object.getOwnPropertyDescriptor(source, propertyName))
      })
    }
  
    class Base extends BaseClass
    {
      constructor (...args) {
        super(...args)
  
        Mixins.forEach((Mixin) => {
          copyProperties(this, new Mixin(...args))
        })
      }
    }
  
    Mixins.forEach((mixin) => {
      copyProperties(Base.prototype, Mixin.prototype)
    })
  
    return Base
  }
