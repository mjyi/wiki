# Schedulers

Schedulers 是 Rx 实现多线程的核心模块，它主要用于控制任务在哪个线程或队列运行。

## subscribeOn

我们用 subscribeOn 来决定数据序列的构建函数在哪个 Scheduler 上运行。

## observeOn

我们用 observeOn 来决定在哪个 Scheduler 监听这个数据序列。

一个比较典型的例子就是，在后台发起网络请求，然后解析数据，最后在主线程刷新页面。你就可以先用 subscribeOn 切到后台去发送请求并解析数据，最后用 observeOn 切换到主线程更新页面。

## MainScheduler

主线程

## SerialDispatchQueueScheduler

抽象了串行 DispatchQueue

## ConcurrentDispatchQueueScheduler

抽象了并行 DispatchQueue

## OperationQueueScheduler

OperationQueueScheduler 抽象了 NSOperationQueue。

它具备 NSOperationQueue 的一些特点，例如，你可以通过设置 maxConcurrentOperationCount，来控制同时执行并发任务的最大数量
