---
title: Vue3小记
category:
  - vue3
---



#  创建项目

## 基于`Vite`创建

```powershell
## 创建
npm create vue@latest

## 项目名
✔ Project name: … <your-project-name>
## 是否添加TS支持，一般Yes
✔ Add TypeScript? … No / Yes
## 是否添加JSX
✔ Add JSX Support? … No / Yes
## 是否配置router
✔ Add Vue Router for Single Page Application development? … No / Yes
## 是否配置Pinia
✔ Add Pinia for state management? … No / Yes
## 是否配置Vite单元测试
✔ Add Vitest for Unit testing? … No / Yes
##是否配置端到端测试
✔ Add an End-to-End Testing Solution? … No / Cypress / Playwright
## 是否启用ESLint
✔ Add ESLint for code quality? … No / Yes

✔ Add Prettier for code formatting? … No / Yes

Scaffolding project in ./<your-project-name>...
Done.
```

创建完成之后运行(先`cd`进入项目根目录)

```powershell
## 安装依赖
npm install

## 启动项目
npm run dev
```



## 目录详解

![目录](https://cdn.jsdelivr.net/gh/EricKiku/pictures@main/img/image-20231225225337440.png)

* `.vscode`：vscode的插件提示文件夹
* `node_modules`：依赖包
* `public`：资源文件夹
* `src`：项目源代码
* `.gitignore`：git忽略配置文件
* `env.d.ts`：文件类型声明文件。如果没有，在`ts`文件中时候如`txt,jpg`等文件时，会报红色下划线
* `index.html`：入口文件
* `package.json`：依赖包声明文件
* `README.md`：项目介绍文件
* `tsconfig.app.json`：ts配置文件
* `vite.config.ts`：工程配置文件



## main.ts

* `Vite`项目中，`index.html`是入口文件，写在项目最外层
* 入口文件通过引入JS标签，使用到`main.ts`
* 在`main.ts`中通过`createApp`函数创建应用实例

```typescript
// 引入createApp 用于创建应用
import { createApp } from "vue";
// 引入App根组件
import App from "./App.vue";

createApp(App).mount("#app")
```



#  核心语法

## setup

`setup`是`vue3`的一个新的配置，值是一个函数，定义好的数据和方法需要使用`return`提交到外部

```vue
<script lang="ts">
export default {
    name: "App",
    setup() {
        // 数据
        let name = 'zhangsan'
        // 方法
        function changeName() {
            name = "zhang-san"
        }
        
        return {
            name,
            changeName
        }
    }
}
</script>
```



`setup`函数中的`return`可以不返回一个对象，而返回一个`函数`，这个函数返回的值，将作为模板渲染到页面。此时页面上只有一个`好`

```vue
return ()=>{
	return `好`
}
```



> 面试题：setup与data和methods之间，时候可以互相获取其中的数据
>
> 1. 在`data`中，可以获取到`setup`中的数据，但是需要使用`this`并且setup需要返回这个数据
>
>    ```vue
>    <script lang="ts">
>    export default {
>        name: "App",
>        data() {
>            return {
>                msg: this.name
>            }
>        },
>        methods: {
>    
>        },
>        setup() {
>            // 数据
>            let name = 'zhangsan'
>            return { name }
>        }
>    }
>    </script>
>    ```
>
> 2. 但是在`setup`中不能读取`data`中的数据



## setup语法糖

频繁的使用`定义数据`和`return`会变得繁琐，所以可以使用`setup语法糖`，在`script`标签中添加一个属性`setup`，这个script会自动的使用setup函数，并且返回其中的数据

```vue
<script setup>
let name = "zhangsan"
</script>
```



如果想要使用两个`setup`标签，那么想要注意 `多个script标签使用的语言必须一样`：

这个代码是不可用的，会报一个`<script> and <script setup> must have the same language type.`的错

```vue
<script lang="ts">
export default {
    name: "App",
}
</script>

<script setup>
let name = "zhangsan"
</script>
```

修改成：

```vue
<script lang="ts">
export default {
    name: "App",
}
</script>

<script lang="ts" setup>
let name = "zhangsan"
</script>
```



## 两个script

使用多个`script`标签的作用是：第一个用于指定组件名，如果不指定，那么组件名就是`文件名`，不利于维护。所以需要两个script标签，第一个不使用`setup`语法糖，定义组件名，第二个使用`setup`语法糖，定义数据

> :bulb:：如果使用`setup`语法糖，则不可以使用`export default{}`写法

```vue
<script lang="ts">
export default {
    name: "App",
}
</script>

<script lang="ts" setup>
let name = "zhangsan"
</script>
```



`插件实现`

但是多写一个标签用来定义组件名有些多余，可以使用一个插件实现

安装

```powershell
npm i vite-plugin-vue-setup-extend -D
```

配置

`vite.config.ts`

```ts
import ViteSetupExtend from "vite-plugin-vue-setup-extend";
...
plugins: [vue(), ViteSetupExtend()],
...
```

使用：在script标签上，可以使用属性`name`指定组件名

```vue
<script lang="ts" setup name="App1">
let name = "zhangsan"
</script>
```



`vue3的defineOptions实现`

需要vue3.3+

```vue
<script lang="ts" setup>
defineOptions({
    name: "App1"
})
</script>
```



## [ref]

定义`基本类型和对象类型的`响应式数据

返回一个`RefImpl实例对象`

:bulb:：在JS中操作数据需要`.value`，在模板中不需要



## [reactive]

定义`对象类型`的响应式

不需要`.value`

```vue
<script lang="ts" setup>
import { reactive } from "vue"
defineOptions({
    name: "App1"
})

let car = reactive([{ id: 1, name: 'eric' }, { id: 2, name: 'kiku' }])

const add = () => {
    car[0].name = 'erickiku'
}
</script>
```



使用原则

1. 基本类型响应式数据用`ref`
2. 对象类型，且层级不深，`ref`和`reactive`都可以
3. 对象类型，层架较深，推荐用`reactive`



## [toRefs]

功能：:gear:把一个`响应式对象`中的键值解构出来，依然维持响应式

使用`reactive`定义的响应式数据在结构之后，会失去响应式，可以使用`toRefs`维持响应式

不使用时：

```js
let person = reactive({ name: "zs", age: 18 })
let { name, age } = person

function changeName() {
    name += "~"
}
```

触发方法，也只会修改解构出的`name`值，不会影响原数据，也没有响应式



使用：

```js
let person = reactive({ name: "zs", age: 18 })
let { name, age } = toRefs(person
                           
function changeName() {
    name.value += "~"
}

```

再触发方法时，会修改原数据的`name`值，即是响应式的，又会修改原对象中的值



:bulb:：`toRef`：一次单一解构一个值：`let name = toRef(person,'name')`。第一个参数是响应式对象，第二个参数是拿出哪个键





## [computed]

计算属性，`有缓存`

引入`computed`，参数是一个函数，函数返回的return，作为计算属性的值



用法

```vue
<script lang="ts" setup>
import { ref, computed } from "vue"
let firstName = ref("张")
let lastName = ref("三")

const getFullName = () => {
    // 实现firstName的首字母大写
    return firstName.value.slice(0, 1).toUpperCase() + firstName.value.slice(1) + lastName.value
}

let fullName = computed(getFullName)

</script>
```

但是这个样式的`computed`是只读，不可改的，如果想要可读可改，想要改成下面的方式：

```vue
<script lang="ts" setup>
import { ref, computed } from "vue"
let firstName = ref("张")
let lastName = ref("三")


let fullName = computed({
    get() {
        return firstName.value.slice(0, 1).toUpperCase() + firstName.value.slice(1) + lastName.value
    },
    set(val) {
        let [str1, str2] = val.split('-')
        firstName.value = str1
        lastName.value = str2
    }
})
function changeFullName() {
    fullName.value = "李-四"
}
</script>
```

这个方式的`computed`的参数是一个`配置对象`，有`get()`和`set()`两个方法，set用于修改，并且可以接收参数



## [watch]

功能:gear:：监视数据的变化

能监视的类型有：

1. `ref`定义的数据
2. `reactive`定义的数据
3. 函数返回一个值(`getter函数`)
4. 一个包含上面内容的数组



`watch`是一个方法，有多个参数，第一个是`监听源`，第二个是`回调函数`，回调函数有两个参数，分别是`新值和旧值`。

有一个返回值，用于`停止监听`

一：`ref`定义的数据

```js
let a = ref(1)
const stopWatch = watch(a, (newValue: number, oldValue) => {
    console.log("a变化了：", oldValue, "->", newValue);
    if (newValue >= 10) {
        stopWatch()
        console.log("停止监听");
    }
})
```



二：`ref`定义的`对象数据`

监听整个响应式对象：

```js
let person = ref({ name: "张三" })
watch(person, () => {
    console.log("person变化了");
})
```

:red_circle:只有`person`对象的地址变化了，才会触发监听



监听对象中的属性变化：

需要开启watch的深度监听`deep`

```js
let person = ref({ name: "张三" })
watch(person, (newValue,oldValue) => {
    console.log("person变化了");
}, { deep: true })
```

:red_circle:开启后，修改对象内属性的值，也会触发监听



提示：

> :bulb:如果修改的是`ref`定义的对象中的属性，那么`newValue`和`oldValue`是同一个值，都是新值
>
> :bulb:如果修改整个`ref`定义的对象，那么`newValue`是新值，`oldValue`是旧值



三：`reactive`定义的对象数据

使用`reactive`定义的响应式监听时，修改对象和修改属性，都会触发监听，因为`隐式开启了深度监听`，且不能关闭。

```js
let person = reactive({ name: "张三" })

function changeName() {
    person.name += "~"
}

function changePerson() {
    Object.assign(person, { name: "李四" })
}

watch(person, (newValue, oldValue) => {
    console.log("person变化:", newValue, oldValue);
})
```

:bulb:`newValue`和`oldValue`仍然是一样的





四：监视`ref`或`reactive`定义的`对象数据`的`某个属性`

* 如果属性是`基础类型`，写成函数式`()=>{return ...}`

  ```js
  let person = reactive({
      name: "张三",
  })
  watch(()=>person.name,()=>{})
  ```

* 如果属性是`对象类型`，可以直接写，建议写成函数式，并且开启深度监视。
  如果直接写`person.parent`，可以监视内容属性变化，不能监视整体对象变化。如果写函数式，只能监视整体变化，需要开启深度监视才可以监视属性变化

  ```js
  let person = reactive({
      parent: {
          p1: "lisi"
      }
  })
  watch(() => person.parent, (newValue, oldValue) => {
      ...
  }, { deep: true })
  ```

  



五：监视多个数据

同时监视多个数据，基础类型，对象类型，对象的属性等

```js
let person = reactive({
    name: "张三",
    parent: {
        p1: "lisi",
        p2: "wangwu"
    }
})
...
watch([() => person.name, () => person.parent.p1], (newValue, oldValue) => {
   ...
})
```

该代码监视的是`person.name`和`person.parent.p1`，其他变化监视不到，只监视这两个，并且`newValue`和`oldValue`是数组



## [watchEffect]

自动监听回调函数中用到的数据

```js
let sum = ref(1)

watchEffect(() => {
    if (sum.value > 2) {
        console.log("超过2了");
    }
})
```



## [标签的ref]

给普通HTML元素添加属性`ref`，再通过js`let xxx = ref()`获得DOM元素

```vue
<h1 ref="h1">hello</h1>
...
let h1 = ref()
```



但是给组件添加属性`ref`获得的是`组件实例`，并且可以在组件中，选择给父组件提供什么数据

`父组件`

```vue
<Index ref="index" />
...
let index = ref()
console.log(index.value);// 打印组件实例
```

`子组件`

使用宏：`defineExpose({...})`

```vue
let a = ref(1)
let b = ref(2)

..
defineExpose({ a, b })
```

在父组件获取该子组件实例后，可以直接获取到提供的数据

```js
console.log(index.value.a);// 打印组件实例
```



## [props]

用于`父组件`给`子组件`传递数据



对于子组件来说，有几种接收的方式：



简单的：直接接收名

```js
defineProps(['list'])
```



接收并且限制类型

```js
// 接收persons,并且必须是实现了接口Persons的
defineProps<{ persons: Persons }>()
```



综上并且可以指定默认值

```js
withDefaults(defineProps<{ persons: Persons }>(), {
    persons: () => {
        return [{ id: '000', name: "王", age: 20 }]
    }
})
```



## [hooks]

`hooks`是组合式API的主要原因

hooks可以把多个`功能集中`的代码，放到一个hooks文件中，再引入到组件中，实现功能高内聚，低耦合

hooks暴露一个`函数`，函数内部处理数据，方法等，可以使用`生命周期`，`computed`、`watch`等方法



用法：如，创建一个求和hooks钩子

`hooks/useSum.ts`

```ts
import { computed, ref } from "vue";

// 默认暴露的函数可以没有函数名，分别暴露的函数必须有函数名
export default function () {
    let sum = ref(1);
    
    // 放大十倍
    let ten = computed(() => {
        return sum.value * 10;
    });


    function add() {
        sum.value++;
    }

    // 重要：向外部提供数据和方法
    return { sum, ten, add };
}

```

`组件中`

```vue
import useSum from "@/hooks/useSum"
...
const { sum,ten, add } = useSum()
```



# 路由

安装

```powershell
npm i vue-router
```

## 创建路由

创建路由文件`router/index.ts`

```ts
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/components/Childred.vue"),
    },
  ],
});

export default router;
```



在`main.ts`中使用

```ts
// 引入createApp 用于创建应用
import { createApp } from "vue";
// 引入App根组件
import App from "./App.vue";

import router from "./router";
createApp(App).use(router).mount("#app");
```



## 工作模式

1. `history`模式

   > 优点：`URL`美观，不带有`#`
   >
   > 缺点：需要服务器配合处理路径问题，否则容易刷新就`404`
   >
   > ```js
   > const router = createRouter({
   >   history: createWebHistory(),
   >   routes: [
   >     {...},
   >   ],
   > });
   > ```

2. `hash`模式

   > 优点：兼容性好，不需要服务器处理路径
   >
   > 缺点：`URL`中带有`#`，不美观，并且`SEO`较差
   >
   > ```js
   > const router = createRouter({
   >   history: createWebHashHistory(),
   >   routes: [
   >     {...},
   >   ],
   > });
   > ```
   >
   > 



## 路由的props配置

使用`props`配置，可以让路由组件通过props接收数据



传输`params`

配置`router/index.ts`

```ts
let routes= [
...
    {
        name: "p2",
        path: "/p2/:id",	//首先先占位
        component: () => import("../views/p2.vue"),
        props: true,		//再开启props
    },
]
```

接收时：

```ts
defineProps(['id']);	//id可以直接使用了
```



传输`query`

配置`router/index.ts`

```ts
let routes= [
...
    {
        name: "p2",
        path: "/p2",
        component: () => import("../views/p2.vue"),
        props(route) {		//使用props返回一个router.query
            return route.query;
        },		
    },
]
```

接收时：

```ts
defineProps(['id']);	//id可以直接使用了
```



## replace

把路由跳转变为`replace`模式

在`RouterLink`标签上添加`replace`属性

```vue
<RouterLink replace to="..."></RouterLink>
```



# Pinia

## 使用

安装

```powershell
npm i pinia
```

使用

```ts
import { createPinia } from "pinia";
const pinia = createPinia();

createApp(App).use(pinia).mount("#app");
```



创建store

`store/xxx.ts`

```ts
import { defineStore } from "pinia";

// 命名以use开头，为hooks
export const useCountStore = defineStore("count", {
  state() {
    return {
      sum: 10,
    };
  },
  actions: {},
  getters: {
    tenSum() {
      return this.sum * 10;
    },
  },
});
```



## 解构

```js
let {data:{content:title}} = await axios(.....)
```

代码意思是从返回数据中解构出`data`，再从data中解构出`content`，并且重命名为`title`

​		

## storeToRefs

在组件中使用时

```vue
// 引入hooks
import { useCountStore } from "@/store/count"

const {sum,tenSum} = useCountStore
```

这样的解构会失去响应式，可以使用`toRefs`，但是后果是store中的所有数据和方法都会变成响应式



可以使用`storeToRefs`，只会把数据变成响应式

```ts
import { storeToRefs } from "pinia"

const { sum, tenSum } = storeToRefs(useCountStore())
```





## $subscribe

订阅，更新`store`中的数据时触发

用法：

```ts
import { storeToRefs } from "pinia";
let countStore = useCountStore();

countStore.$subscribe((mutate, state) => {
    console.log("更新:", mutate, state);
})
```



接收一个`回调函数`，回调函数中有两个参数，第二个重要，是更新后的`state`



## 组合式

pinia的store可以写成选项式，也可以使用`组合式`，就像在`setup`中写数据和方法一样

最后把数据和方法返回出去

```ts
import { defineStore } from "pinia";
import { computed, ref } from "vue";
export const useCountStore = defineStore("count", () => {
  let sum = ref(1);
  let tenSum = computed(() => {
    return sum.value * 10;
  });

  function add() {
    sum.value++;
  }

  return { sum, tenSum, add };
});
```

组件使用式：

```ts
import { storeToRefs } from "pinia";
let countStore = useCountStore();
// 在这里解构数据的话，会丢失响应式
const { add } = useCountStore();
// 使用storeToRefs不会丢失响应式
const { sum, tenSum } = storeToRefs(countStore);
```



# 组件通信

## props

`props`可以`父传子`，也可以`子传父`

父传子：

`父`

```vue
<PropsChild :car="car" />
```

`子`

```vue
defineProps(['car']);
```



子传父：

`父`

```vue
<PropsChild :sendToy="getToy" />
...
// 父亲需要定义一个方法
function getToy(value: string) {
    console.log(value);
}
```

`子`

```vue
<button @click="sendToy(toy)">给玩具</button>
...
defineProps(['sendToy'])
```



## `$event`事件对象

给组件绑定单击事件时，可以使用$event占位，代表这个数据传的是事件对象

```vue
<button @click="sendToy(1,$event)"></button>
```



对于原生元素的事件，$event就是事件对象，可以`.target.value`取到值

对于自定义事件，$event就是触发事件时，所传递的参数，不能`.target`



## emits

自定义事件

父组件定义方法，给子组件绑定方法

```vue
<PropsChild @send-toy="getToy" />

...
function getToy(value: string) {
    console.log(value);
}
```

子组件声明事件，并且触发

```vue
let emits = defineEmits(["send-toy"])
...
emits("send-toy", "玩具")
```





## mitt

一个工具插件，用于组件通信

安装

```powershell
npm i mitt
```

创建文件

`emiiter.ts`

```ts
import mitt from "mitt";

const emitter = mitt();

export default emitter;
```



引入

`main.ts`

```ts
import emitter from "./tools/emitter";
```



使用

1. 绑定事件`emitter.on("test", (value) =>{}) `
2. 触发事件`emitter.emit("test",value)`
3. 解绑所有`emitter.all.clear()`
4. 解绑指定`emiiter.off("test")`



可以实现在任意组件间通信

`xxx.vue`

```ts
import emitter from "@/tools/emitter";

emitter.on("test", (value) => {
    console.log("mitt");
})
```

`xxx.vue`

```ts
import emitter from "@/tools/emitter";

function useMitt() {
    emitter.emit("test",666);
}
```



注意：最好在组件卸载式，解绑事件





## v-model

对自定义组件使用`v-model`，实现双向绑定

子组件：

`EInput.vue`

```vue
<template>
    <input type="text" :value="modelValue" @input="emits('update:modelValue', (<HTMLInputElement>$event.target).value)">
</template>

<script lang="ts" setup>
import { ref } from "vue"
    
defineProps(['modelValue'])
    
let emits = defineEmits(['update:modelValue'])
</script>

<style lang="less" scoped>
</style>
```

`父组件`

```vue
<EInput v-model="username" />
```



原理就是组件的`v-model`属性实际上是两个属性的结合，`:modelValue`和`@update:modelValue`，自定义组件接收这个数据和自定义事件，使用`v-bind`绑定数据，使用`update:modelValue`触发更新，从而实现双向绑定





另外，`v-model`后可以指定变量名，如

```vue
<EInput v-model:username="username" v-model-password="password"/>
```

那在子组件中接收时就需要

```ts
defineProps(['username','password'])
let emits = defineEmits(['update:username','update:password'])
```

好处是可以传多个v-model





## $attrs

用于`祖-孙`传递数据，方法是通过给子组件一些`props`，但是子组件并不接收，而是使用`v-bind:"$attrs"`，交给孙组件

孙组件正常使用`props`接收

祖组件：

```vue
<EInput msg="msg" v-bind="{ x: 1, y: 2 }" />
```

子组件

```vue
<Sun v-bind="$attrs" />
```

孙组件`Sun.vue`

```ts
// 都是可以接收到的
defineProps(['msg', 'x', 'y'])
```



孙传祖只需要祖先传递一个方法，孙组件触发方法即可。





## `$refs`/`$parent`

`$refs`用于获取该组件中所有被`ref`标记的子组件，返回一个对象，键名是`ref标记名`，值是`组件实例对象`

```vue
<template>
    <!-- 子组件1 -->
    <PropsChild ref="child1" />
    <!-- 子组件2 -->
    <PropsChild ref="child2" />
    <button @click="test($refs)">测试</button>
</template>

<script lang="ts" setup>
function test(refs){
    console.log(refs);//打印结果:{child1:xxx,child2:xxx}
}
</script>
```

同时子组件也必须把自己想要被父组件修改的数据，使用`defineExpose({})`提供



`$parent`用于获取该组件的父组件，如果想要修改父组件中的数据，也需要在父组件中使用`defineExpose`向外部提供数据

子组件

```vue
<template>
    <button @click="test($parent)">测试</button>
</template>

<script lang="ts" setup name="PropsChild">
function test(parent: any) {
    console.log(parent);
    parent.money = 10000;
}
</script>

```

父组件

```vue
<template>
    <PropsChild/>
</template>

<script lang="ts" setup>
import PropsChild from "./components/PropsChild.vue";

let money = ref(5000)
	
defineExpose({ money })
</script>
```





## provide

`provide `和`inject`是vue自带的方法，`provide`是用来向后代`提供数据`，`inject`是注入先代提供的数据

先代组件：

```ts
import { ref, provide } from "vue"

let money = ref(1000)
function minusMoney(value: number) {
    money.value -= value
}
provide('money', { money, minusMoney })
```

提供数据的时候，不要`.value`，因为会失去响应式



后代组件

```ts
import { ref, inject } from "vue"

let { money, minusMoney } = inject('money', { money: 0, minusMoney: (value: number) => { } })
```

可以解构出数据和方法，既能获取数据，又能修改数据。`inject`接收第二个参数，是默认值，当找不到注入的数据时，使用默认值。如果有时候ts推断不出注入的类型而导致红色下划线时，可以使用默认值



# 插槽

## 默认插槽

在组件中给即将插入的元素占位

子组件`Card.vue`

```vue
<template>
    <div class="card">
        <h3>{{ title }}</h3>
        <!-- 插槽占位 -->
        <slot></slot>
    </div>
</template>
```

使用时：

```vue
<Card title="游戏推荐">
    <ul>...</ul>
</Card>
```

`ul`元素会插入到`<slot>`标签所在的位置

并且多个默认插槽会使插入的内容复制多份，所以一般只用一个默认插槽



## 具名插槽

可以在使用时，指定要插入的插槽位置，首先需要在子组件中给插槽定义名字

子组件

```vue
<template>
    <div class="card">
        <slot name="main">默认内容</slot>
        <slot name="footer">默认底部</slot>
    </div>
</template>
```

使用时，使用`v-slot`指令，这个指令只能用在`自定义组件`或者`template`标签上，后面是指定的插槽名。

```vue
<Card title="游戏推荐">
    <template v-slot:main>
		...
    </template>
    <template v-slot:footer>
		...
    </template>
</Card>
```

`v-slot:main`可以简写成`#main`

可以动态的指定插槽名：`v-slot:[动态名字]`或者`#[动态名字]`

## 作用域插槽

当父组件使用插槽时，如果想要子组件内的数据，则需要`组用于插槽`

官方：[Vue3插槽](https://cn.vuejs.org/guide/components/slots.html#scoped-slots)



# 其他

## shallowRef

浅层次的响应式，只会把`第一层`报错响应式，第一层指的是`xx.value`

如

```ts
import { ref, shallowRef } from "vue"

let person = shallowRef({
    name: "zhangsan"
})
function changeName() {
    person.value.name += "~";// 没有效果，因为.name也就是第二层了 
}
function newPerson() {
    person.value = {	//有效果
        name: "lisi"
    }
}
```



## shallowReactive

与shallowRef同理，

如以下代码，其中的`name`和`info`是具有响应式的，但`class`是没有响应式的

```ts
import { ref, shallowReactive } from "vue"

let person = shallowReactive({
    name: "zhangsan",
    info: {
        class: "1"
    }
})
```



## readonly

让一个变量只读，并且`readonly`接收的参数必须是一个`响应式对象`

```ts
import { ref, readonly } from "vue"
let sum = readonly(ref(1))
```



`shallowReadonly`

浅层只读，只不能修改第一层，深层次可以修改



## toRaw

把一个`响应式对象`变成一个`原始数据`

一般用于临时修改响应式数据，但是不希望页面发生变化的场景，参数是一个`响应式数据`



`markRaw`

标记一个对象，使其`永远不会`成为响应式

```ts
import {ref,markRaw} from "vue"

let car = markRaw({name:"宝马"})
let car1 = ref(car);	//失效，不会变成响应式的
```



在使用其他库时，可以标记`markRaw`，使其永远不会变成响应式的，防止后续写错，变成响应式的，造成性能影响



## customRef

创建一个自定义的`ref`，并对其依赖项跟踪和更新触发进行`逻辑控制`

一般封装成`hooks`

官方文档：[官方文档](https://cn.vuejs.org/api/reactivity-advanced.html#customref)

示例：

一个防抖hooks

```ts
import { customRef } from "vue";

export const useDebounced = (value, delay = 200) => {
  let timeout;
  return customRef((tract, trigger) => {
    return {
      get() {
        tract();
        return value;
      },
      set(newValue) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      },
    };
  });
};

```





# 新组件

## teleport

`传送组件`，可以把包裹的HTML结构传送到任意标签中，并且逻辑代码，样式代码都不会消失



在有些时候，元素的样式，位置，可以会被父元素影响，产生一些意想不到的问题，如父组件使用了`filter`滤镜属性，会影响子组件使用`position:fixed;`的位置，导致`fixed`不再是以视图为基准了，所以需要把子组件传送到不会被影响的位置。



使用

```vue
<teleport to='body'>
    <div class="dialog" v-if="show">
        <slot name="content">
            <div>我是对话框</div>
        </slot>
    </div>
</teleport>
```



标签上有一个`to`属性，用于指定此代码传送到哪个标签中，`to`的值可以是任意`css选择器`，id，类，或标签名

可以用来实现`对话框`等组件



## Suspense

异步组件，可以包裹一个异步的组件，让组件没有请求完成时显示默认样式，请求完成后显示组件

定义一个异步组件

```vue
<template>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import axios from "axios"

let data = await axios.get("https://api.uomg.com/api/rand.qinghua?format=json")
</script>
```



在使用该组件的地方

先引入`Suspense`

```vue
import { ref, Suspense } from "vue"
```

在模板中使用

```vue
<template>
    <Suspense>
        <template v-slot:default>
            <ApiComponent />
        </template>
    </Suspense>
</template>
```



需要使用`template`，有两个插槽，`default`和`fallback`

默认插槽是请求完成后，展示的组件，`fallback`是正在请求时，展示的组件



## 全局API转移

转移至应用对象

### `app.component`

全局注册组件，定义好一个组件后，在`main.ts`中引入，并且使用`app.component()`注册

有两个参数，第一个是使用时的组件名，第二个是组件实例

示例

```ts
import Hello from "@/component/Hello.vue"

const app = createApp(App)

app.component("Hello",Hello);//全局都可以使用该组件
```



### `app.config`





### `app.directive`

注册全局指令

在`main.ts`中注册指令，第一次参数是指令名，第二个是函数。函数接收两个参数，分别是`element`，和`{value}`

示例

```ts
function beautify(element, { value }) {
  element.innerHTML = value;
  element.style.color = "skyblue";
}

app.directive("beautify", beautify)
```



在任意组件中使用时，需要使用`v-`加上注册的指令名

```vue
<div v-beautify="'hello'"></div>
```



### `app.mount`

挂载

### `app.unmount`

卸载

### `app.use`

安装插件





# 迁移

[从V2迁移](https://v3-migration.vuejs.org/zh/)

[非兼容性改变](https://v3-migration.vuejs.org/zh/breaking-changes/)
