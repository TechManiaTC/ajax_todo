// WEIBO API
// 获取所有 weibo
var apiWeiboAll = function(callback) {
    var path = '/api/weibo/all'
    ajax('GET', path, '', callback)
}

// 增加一个 weibo
var apiWeiboAdd = function(form, callback) {
    var path = '/api/weibo/add'
    ajax('POST', path, form, callback)
}

var apiWeiboDelete = function(id, callback) {
    var path = `/api/weibo/delete?id=${id}`
    ajax('GET', path, '', callback)
}

var apiWeiboUpdate = function(form, callback) {
    var path = '/api/weibo/update'
    ajax('POST', path, form, callback)
}

var weiboTemplate = function(weibo) {
// WEIBO DOM
    var t = `
        <div class="weibo-cell" id="weibo${weibo.id}">
            <button data-id=${weibo.id} class="weibo-delete">删除</button>
            <button data-id=${weibo.id} class="weibo-edit">编辑</button>
            <button data-id=${weibo.id} class="comment-add">评论</button>
            <span class="weibo-content">${weibo.content}</span>
        </div>
    `
    return t
}

var weiboUpdateTemplate = function(weiboId) {
// WEIBO DOM
    var t = `
        <div class="weibo-update-form">
            <input class="weibo-update-input">
            <button data-id=${weiboId} class="weibo-update">更新微博</button>
        </div>
    `
    return t
}


var insertWeibo = function(weibo) {
    var weiboCell = weiboTemplate(weibo)
    // 插入 weibo-list
    var weiboList = e('.weibo-list')
    weiboList.insertAdjacentHTML('beforeend', weiboCell)
}

var insertUpdate = function(edit_button) {
    var weiboId = edit_button.dataset.id
    var editCell = weiboUpdateTemplate(weiboId)
    edit_button.parentElement.insertAdjacentHTML('beforeend', editCell)
}

var loadWeibos = function() {
    // 调用 ajax api 来载入数据
    // weibos = api_weibo_all()
    // process_weibos(weibos)
    apiWeiboAll(function(r) {
        // console.log('load all', r)
        // 解析为 数组
        var weibos = JSON.parse(r)
        // log('json parse', weibos)
        // 循环添加到页面中
        for(var i = 0; i < weibos.length; i++) {
            var weibo = weibos[i]
            insertWeibo(weibo)
        }
    })
}

var bindEventWeiboAdd = function() {
    var b = e('#id-button-add')
    // 注意, 第二个参数可以直接给出定义函数
    b.addEventListener('click', function(){
        var input = e('#id-input-weibo')
        var content = input.value
        log('click add', content)
        var form = {
            content: content,
        }
        apiWeiboAdd(form, function(r) {
            // 收到返回的数据, 插入到页面中
            var weibo = JSON.parse(r)
            insertWeibo(weibo)
        })
    })
}

var bindEventWeiboDelete = function() {
    /*
    给 删除 按钮绑定删除的事件
    1, 绑定事件
    2, 删除整个 weibo-cell 元素
    */
    var weiboList = e('.weibo-list')
    // 事件响应函数会被传入一个参数, 就是事件本身
    weiboList.addEventListener('click', function(event){
        // log('click weibolist', event)
        // 我们可以通过 event.target 来得到被点击的元素
        var self = event.target
        // log('被点击的元素是', self)
        // 通过比较被点击元素的 class 来判断元素是否是我们想要的
        // classList 属性保存了元素的所有 class
        // 在 HTML 中, 一个元素可以有多个 class, 用空格分开
        // log(self.classList)
        // 判断是否拥有某个 class 的方法如下
        if (self.classList.contains('weibo-delete')) {
            log('点到了 删除按钮，id 是', self.dataset.id )
            var weiboId = self.dataset.id
            // 删除 self 的父节点
            // parentElement 可以访问到元素的父节点
            apiWeiboDelete(weiboId, function(r) {
                self.parentElement.remove()
            })
        } else {
            log('点击的不是删除按钮******')
        }
    })
}

var bindEventWeiboEdit = function(){
    var weiboList = e('.weibo-list')
    // 事件响应函数会被传入一个参数, 就是事件本身
    weiboList.addEventListener('click', function(event){
        // log('click weibolist', event)
        // 我们可以通过 event.target 来得到被点击的元素
        var self = event.target
        // log('被点击的元素是', self)
        // 通过比较被点击元素的 class 来判断元素是否是我们想要的
        // classList 属性保存了元素的所有 class
        // 在 HTML 中, 一个元素可以有多个 class, 用空格分开
        // log(self.classList)
        // 判断是否拥有某个 class 的方法如下
        if (self.classList.contains('weibo-edit')) {
            log('点到了 编辑微博按钮，id 是', self.dataset.id )
            // 插入编辑输入框
            insertUpdate(self)
        } else {
            log('点击的不是编辑按钮******')
        }
    })
}


var bindEventWeiboUpdate = function(){
    var weiboList = e('.weibo-list')
    weiboList.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('weibo-update')) {
            log('点到了 更新微博按钮，id 是', self.dataset.id )

            var weiboCell = self.closest('.weibo-cell')
            var input = weiboCell.querySelector('.weibo-update-input')
            var weiboId = self.dataset.id
            var form = {
                id: weiboId,
                content: input.value,
            }

            apiWeiboUpdate(form, function(r){
                log('收到更新数据', r)

                var updateForm = weiboCell.querySelector('.weibo-update-form')
                updateForm.remove()

                var weibo = JSON.parse(r)
                var weiboTask = weiboCell.querySelector('.weibo-content')
                weiboTask.innerText = weibo.content
            })
        } else {
            log('点击的不是更新按钮******')
        }
    })
}

var bindEvents = function() {
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboEdit()
    bindEventWeiboUpdate()
}

var __main = function() {
    bindEvents()
    loadWeibos()
}

__main()
