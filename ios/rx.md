# RxSwift

> 推荐文档
- [RxSwift 官方文档](https://github.com/ReactiveX/RxSwift/blob/master/Documentation/)
- [Rx Marbles]
(http://rxmarbles.com/)

## Observables aka Sequences

__每个 Observable 序列只是一个序列。Observable 相较 Swift 的SequenceType 的核心优势是它能异步的接收元素。这是 RxSwift 的核心。__

当我们使用序列语法作为常规表达式：

_Next (Error | Completed)?*_

- 序列可以有0或多个元素
- 一旦一个`Error` 或者 `Completed` 事件被接收，那么序列将不能产生任何其他元素。

!> 当一个序列发送 `Completed` 或者 `Error`事件，所有计算序列的内部资源将被释放

**为了取消生产序列元素和立刻释放资源，可以在返回的订阅上调用 dispose 方法。**

如果一个序列终止于有限次数，不调用 `dispose` 或者不使用 `addDisposableTo(disposeBag)` 将不会引起任何永久的资源泄露。无论如何，当这个序列完成时，这些资源都会被释放，或者通过处理完所有元素，或通过返回一个错误。

如果一个序列由于某些原因没有终止，资源将会被永久分配，除非 dispose 被手动调用，自动加入一个 disposeBag, takeUntil 或一些其他方法。

**使用 dispose bags 或者 takeUntil 操作符是一个健壮的确认资源被释放的方法。**

## Disposing

一个被观察了的序列有一个额外的方法被终止。当我们完成一个序列然后想去释放所有已分配的资源，我们可以在一个订阅上调用 `dispose` 方法。

但是手动调用 `dispose` 是一个坏的做法。

### Dispose Bags

`Dispose bags` 之于 RX 被用来返回类似ARC的行为。

当一个 `DisposeBag` 被销毁，它会在每一个已加入的可处置对象中调用 `dispose` 方法。

因为他没有 dispose 方法，所以不允许在目标上显式调用 dispose 方法。如果需要马上清理，我们仅需创建一个新的dipose bag。
```swift
  self.disposeBag = DisposeBag()
```
这会清理旧的引用并且触发资源处理。

#### Take until

还有一个销毁时自动处理订阅的方法，那就是使用 takeUntil 操作符。
```swift
sequence
    .takeUntil(self.rx_deallocated)
    .subscribe {
        print($0)
    }
```

## Observable 隐式惯例

还有一些额外的保证，所有的序列制作者（Observable）必须遵守。

无论生产者在哪个线程制造元素，如果他们生成一个元素并且发送给观察者(observer) observer.on(.Next(nextElement)), 他们不能发送下一个元素直到 observer.on 方法完成执行。

如果.next事件尚未完成，生产者也无法发送终止.completed或.error。

## Create Observable (aka observable sequence)

当一个 observable 被创建，它不会因为它已经创建而执行任何工作。

*Observable 可以通过多种方式生成元素。其中一些会导致副作用，其中一些会利用现有的运行流程，如鼠标的点击事件等*

## Observable

observer 订阅 Observable。然后该 observer 对Observable发出的任何项目或项目序列作出反应。这种模式有利于并发操作，因为它在等待 Observable 发送对象时不需要阻塞，而是以 observer 的形式创建一个哨兵，随时准备在 Observable 将来的任何时间作出适当的反应。

### Single

- 发出一个元素，或一个 `error` 事件
- 不会共享状态变化

### Completable

- 发出零个元素
- 发出一个 completed 事件或者一个 error 事件
- 不会共享状态变化

适用于那种你只关心任务是否完成，而不需要在意任务返回值的情况。

### Maybe

- 发出一个元素或者一个 completed 事件或者一个 error 事件
- 不会共享状态变化

### Driver

主要是为了简化 UI 层的代码。

- 不会产生 error 事件
- 一定在 MainScheduler 监听（主线程监听）
- 共享状态变化

__任何可被监听的序列都可以被转换为 `Driver`__

- 不会产生 error 事件
- 一定在 MainScheduler 监听（主线程监听）
- 共享状态变化

_asDriver(onErrorJustReturn: [])_ 等价于：

```swift
let safeSequence = xs
  .observeOn(MainScheduler.instance)       // 主线程监听
  .catchErrorJustReturn(onErrorJustReturn) // 无法产生错误
  .share(replay: 1, scope: .whileConnected)// 共享状态变化
return Driver(raw: safeSequence)           // 封装
```
### ControlEvent

ControlEvent 专门用于描述 UI 控件所产生的事件。

- 不会产生 error 事件
- 一定在 MainScheduler 订阅（主线程订阅）
- 一定在 MainScheduler 监听（主线程监听）
- 共享状态变化

## Observable & Observer

> 在我们所遇到的事物中，有一部分非常特别。它们既是可被监听的序列也是观察者。

例如： `textField` 的当前文本

```swift
// 作为可被监听的序列
let observable = textField.rx.text
observable.subscribe(onNext: { text in show(text: text) })

// 作为观察者
let observer = textField.rx.text
let text: Observable<String?> = ...
text.bind(to: observer)
```
框架里面定义了一些辅助类型，它们既是可被监听的序列也是观察者。如果你能合适的应用这些辅助类型，它们就可以帮助你更准确的描述事物的特征。

### AsyncSubject

AsyncSubject 将在源 Observable 产生完成事件后，**发出最后一个元素（仅仅只有最后一个元素）**，如果源 Observable 没有发出任何元素，只有一个完成事件。那 AsyncSubject 也只有一个完成事件。

它会对随后的观察者发出最终元素。如果源 Observable 因为产生了一个 error 事件而中止， AsyncSubject 就不会发出任何元素，而是将这个 error 事件发送出来。

### PublishSubject

PublishSubject 将对观察者发送 **订阅后** 产生的元素，而在订阅前发出的元素将不会发送给观察者。

如果源 Observable 因为产生了一个 error 事件而中止， PublishSubject 就不会发出任何元素，而是将这个 error 事件发送出来。

### ReplaySubject

ReplaySubject 将对观察者发送 **全部** 的元素，无论观察者是何时进行订阅的。

如果把 ReplaySubject 当作观察者来使用，注意不要在多个线程调用 onNext, onError 或 onCompleted。这样会导致无序调用，将造成意想不到的结果。

### BehaviorSubject

当观察者对 BehaviorSubject 进行订阅时，它会将源 Observable 中 **最新的元素发送出来（如果不存在最新的元素，就发出默认元素）**。然后将随后产生的元素发送出来。

### Variable

Variable 封装了一个 BehaviorSubject，所以它会持有当前值，并且 Variable 会对新的观察者发送当前值。它不会产生 error 事件。Variable 在 deinit 时，会发出一个 completed 事件。



