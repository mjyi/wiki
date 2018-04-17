# 工厂模式

工厂模式主要是为创建对象提供了接口。

## 简单工厂模式

简单工厂模式又称为静态工厂模式，简单工厂模式的作用就是创建一个工厂类用来创建其它类的实例，被创建的实例通常具有共同的父类。至于类是怎么样创建的对用户来说是不可见的“屏蔽细节”。

```swift
class Operation {
  var numberA: Double = 0.0;
  var numberB: Double = 0.0;
  
  public func getResult() -> Double {
    return 0.0;
  }
}

class OperationAdd: Operation {
  override func getResult() -> Double {
    let result = numberA + numberB;
    return result;
  }
}

class OperationSub: Operation {
  override func getResult() -> Double {
    let result = numberA - numberB;
    return result;
  }
}

class OperationMul: Operation {
  override func getResult() -> Double {
    let result = numberA * numberB;
    return result;
  }
}

class OperationDiv: Operation {
  override func getResult() -> Double {
    
    guard numberB != 0 else {
      print("NumberB can not be zore")
      return 0;
    }
    
    let result = numberA / numberB;
    return result;
  }
}


class OperationFactory {
  static func createOperation(operate: String
    ) -> Operation? {
    
    var oper: Operation?
    
    switch operate {
    case "+":
      oper = OperationAdd()
    case "-":
      oper = OperationSub()
    case "*":
      oper = OperationMul()
    case "/":
      oper = OperationDiv()
    default:
      oper = nil
    }
    return oper
  }
}

// 使用
let oper = OperationFactory.createOperation(operate: "/")

oper?.numberA = 20
oper?.numberB = 4
oper?.getResult()


```

## 工厂方法模式

定义一个用于创建对象的接口，让子类决定实例化哪一个类。
工厂方法使一个类的实例化延迟到其子类。

```swift
protocol IFactory {
  func createOperation() -> Operation
}

class AddIFactory: IFactory {
  func createOperation() -> Operation {
    return OperationAdd()
  }
}

class SubIFactory: IFactory {
  func createOperation() -> Operation {
    return OperationSub()
  }
}

class MulIFactory: IFactory {
  func createOperation() -> Operation {
    return OperationMul()
  }
}

class DIvIFactory: IFactory {
  func createOperation() -> Operation {
    return OperationDiv()
  }
}

let operrFactory = AddIFactory()
let operr = operrFactory.createOperation()
operr.numberB = 20
operr.numberA = 33
operr.getResult()
```

## 抽象方法模式
