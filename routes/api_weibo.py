from utils import log
from routes import json_response, current_user
from models.weibo import Weibo


# 本文件只返回 json 格式的数据
# 而不是 html 格式的数据
def all(request):
    weibos = Weibo.all_json()
    return json_response(weibos)


def add(request):
    # 得到浏览器发送的表单, 浏览器用 ajax 发送 json 格式的数据过来
    # 所以这里我们用新增加的 json 函数来获取格式化后的 json 数据
    form = request.json()
    u = current_user(request)
    user_id = int(u.id)
    # 创建一个 weibo
    t = Weibo.new(form, user_id)
    # 把创建好的 weibo 返回给浏览器
    return json_response(t.json())


def delete(request):
    weibo_id = int(request.query.get('id'))
    t = Weibo.delete(weibo_id)
    return json_response(t.json())


def update(request):
    form = request.json()
    log('api weibo update', form)
    weibo_id = int(form.get('id'))
    t = Weibo.update(weibo_id, form)
    return json_response(t.json())


def route_dict():
    d = {
        '/api/weibo/all': all,
        '/api/weibo/add': add,
        '/api/weibo/delete': delete,
        '/api/weibo/update': update,
    }
    return d
