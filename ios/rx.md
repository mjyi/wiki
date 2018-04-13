> 推荐文档
- [RxSwift 官方文档](https://github.com/ReactiveX/RxSwift/blob/master/Documentation/)

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

