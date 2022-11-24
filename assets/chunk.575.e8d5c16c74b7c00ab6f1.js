/*! For license information please see chunk.575.e8d5c16c74b7c00ab6f1.js.LICENSE.txt */
"use strict";(globalThis.webpackChunk_ember_auto_import_=globalThis.webpackChunk_ember_auto_import_||[]).push([[575],{950:(t,e,n)=>{function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}n.d(e,{_z:()=>h})
var r=n(173),o=n(341),a=n(283),s=n(292),c=n(353)
const u=()=>[]
class h{static from(t,e){return"function"==typeof t?{thunk:t,definition:this,type:"class-based",__INTERNAL__:!0}:function(t,e,n){let i
return(0,c.assert)(`Expected second argument, klass, to be a Resource. Instead, received some ${typeof e}, ${e.name}`,e.prototype instanceof h),new Proxy({get value(){return i||(i=(0,a.invokeHelper)(t,e,(()=>function(t){if(!t)return{named:{},positional:[]}
let e=t()
return Array.isArray(e)?{named:{},positional:e}:e?"positional"in e||"named"in e?e:{named:e,positional:[]}:{named:{},positional:[]}}(n||u)))),(0,r.getValue)(i)}},{get(t,e){const n=t.value,i=Reflect.get(n,e,n)
return"function"==typeof i?i.bind(n):i},ownKeys(t){const e=t.value
return Reflect.ownKeys(e)},getOwnPropertyDescriptor(t,e){const n=t.value
return Reflect.getOwnPropertyDescriptor(n,e)}})}(t,this,e)}constructor(t){(0,s.setOwner)(this,t)}}class f{constructor(t){i(this,"capabilities",(0,a.capabilities)("3.23",{hasValue:!0,hasDestroyable:!0})),this.owner=t}createHelper(t,e){let n,i=this.owner,a=(0,r.createCache)((()=>(void 0===n&&(n=new t(i),(0,o.associateDestroyableChild)(a,n)),n.modify&&n.modify(e.positional,e.named),n)))
return a}getValue(t){return(0,r.getValue)(t)}getDestroyable(t){return t}}(0,a.setHelperManager)((t=>new f(t)),h)
var l,d,p,v,y,g,m,b=n(521)
l=class{constructor(t){var e;(e=d)&&Object.defineProperty(this,"current",{enumerable:e.enumerable,configurable:e.configurable,writable:e.writable,value:e.initializer?e.initializer.call(this):void 0}),i(this,"toggle",(()=>{(0,c.assert)("toggle can only be used when 'current' is a boolean type","boolean"==typeof this.current||void 0===this.current),this.current=!this.current})),i(this,"update",(t=>{this.current=t(this.current)})),i(this,"set",(t=>{this.current=t})),void 0!==t&&(this.current=t)}},p=l.prototype,v="current",y=[b.tracked],g={configurable:!0,enumerable:!0,writable:!0,initializer:null},m={},Object.keys(g).forEach((function(t){m[t]=g[t]})),m.enumerable=!!m.enumerable,m.configurable=!!m.configurable,("value"in m||m.initializer)&&(m.writable=!0),void 0===(m=y.slice().reverse().reduce((function(t,e){return e(p,v,t)||t}),m)).initializer&&(Object.defineProperty(p,v,m),m=null),d=m},464:(t,e,n)=>{n.d(e,{Xg:()=>c,f3:()=>u,mu:()=>s,vk:()=>h})
var i=n(432),r=n(861),o=n(500)
function a(t){var e
return(e={id:t,send:function(){},subscribe:function(){return{unsubscribe:function(){}}},getSnapshot:function(){},toJSON:function(){return{id:t}}})[r.L$]=function(){return this},e}function s(t,e,n,i){var o,s=(0,r.j)(t.src),u=null===(o=null==e?void 0:e.options.services)||void 0===o?void 0:o[s.type],h=t.data?(0,r.QX)(t.data,n,i):void 0,f=u?c(u,t.id,h):a(t.id)
return f.meta=t,f}function c(t,e,n){var i=a(e)
if(i.deferred=!0,(0,r.O4)(t)){var s=i.state=(0,o.J)(void 0,(function(){return(n?t.withContext(n):t).initialState}))
i.getSnapshot=function(){return s}}return i}function u(t){return function(t){try{return"function"==typeof t.send}catch(t){return!1}}(t)&&"id"in t}function h(t){var e
return(0,i.pi)(((e={subscribe:function(){return{unsubscribe:function(){}}},id:"anonymous",getSnapshot:function(){}})[r.L$]=function(){return this},e),t)}},569:(t,e,n)=>{n.d(e,{TL:()=>h,ZM:()=>l,j1:()=>f,j_:()=>u})
var i=n(432),r=n(34),o=n(861),a=n(215),s=n(804),c=n(197)
function u(t,e){if(t===e)return!0
if(void 0===t||void 0===e)return!1
if((0,o.HD)(t)||(0,o.HD)(e))return t===e
var n=Object.keys(t),i=Object.keys(e)
return n.length===i.length&&n.every((function(n){return u(t[n],e[n])}))}function h(t){return"object"==typeof t&&null!==t&&"value"in t&&"_event"in t}function f(t,e){var n=t.exec
return(0,i.pi)((0,i.pi)({},t),{exec:void 0!==n?function(){return n(e.context,e.event,{action:t,state:e,_event:e._event})}:void 0})}var l=function(){function t(t){var e,n=this
this.actions=[],this.activities=r.qP,this.meta={},this.events=[],this.value=t.value,this.context=t.context,this._event=t._event,this._sessionid=t._sessionid,this.event=this._event.data,this.historyValue=t.historyValue,this.history=t.history,this.actions=t.actions||[],this.activities=t.activities||r.qP,this.meta=(0,a.xZ)(t.configuration),this.events=t.events||[],this.matches=this.matches.bind(this),this.toStrings=this.toStrings.bind(this),this.configuration=t.configuration,this.transitions=t.transitions,this.children=t.children,this.done=!!t.done,this.tags=null!==(e=Array.isArray(t.tags)?new Set(t.tags):t.tags)&&void 0!==e?e:new Set,this.machine=t.machine,Object.defineProperty(this,"nextEvents",{get:function(){return(0,a.nJ)(n.configuration)}})}return t.from=function(e,n){return e instanceof t?e.context!==n?new t({value:e.value,context:n,_event:e._event,_sessionid:null,historyValue:e.historyValue,history:e.history,actions:[],activities:e.activities,meta:{},events:[],configuration:[],transitions:[],children:{}}):e:new t({value:e,context:n,_event:s.initEvent,_sessionid:null,historyValue:void 0,history:void 0,actions:[],activities:void 0,meta:void 0,events:[],configuration:[],transitions:[],children:{}})},t.create=function(e){return new t(e)},t.inert=function(e,n){if(e instanceof t){if(!e.actions.length)return e
var i=s.initEvent
return new t({value:e.value,context:n,_event:i,_sessionid:null,historyValue:e.historyValue,history:e.history,activities:e.activities,configuration:e.configuration,transitions:[],children:{}})}return t.from(e,n)},t.prototype.toStrings=function(t,e){var n=this
if(void 0===t&&(t=this.value),void 0===e&&(e="."),(0,o.HD)(t))return[t]
var r=Object.keys(t)
return r.concat.apply(r,(0,i.ev)([],(0,i.CR)(r.map((function(i){return n.toStrings(t[i],e).map((function(t){return i+e+t}))}))),!1))},t.prototype.toJSON=function(){var t=this
t.configuration,t.transitions
var e=t.tags
t.machine
var n=(0,i._T)(t,["configuration","transitions","tags","machine"])
return(0,i.pi)((0,i.pi)({},n),{tags:Array.from(e)})},t.prototype.matches=function(t){return(0,o.W)(t,this.value)},t.prototype.hasTag=function(t){return this.tags.has(t)},t.prototype.can=function(t){var e
c.M&&(0,o.ZK)(!!this.machine,"state.can(...) used outside of a machine-created State object; this will always return false.")
var n=null===(e=this.machine)||void 0===e?void 0:e.getTransitionData(this,t)
return!!(null==n?void 0:n.transitions.length)&&n.transitions.some((function(t){return void 0!==t.target||t.actions.length}))},t}()},432:(t,e,n)=>{n.d(e,{CR:()=>a,XA:()=>o,_T:()=>r,ev:()=>s,pi:()=>i})
var i=function(){return i=Object.assign||function(t){for(var e,n=1,i=arguments.length;n<i;n++)for(var r in e=arguments[n])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])
return t},i.apply(this,arguments)}
function r(t,e){var n={}
for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&e.indexOf(i)<0&&(n[i]=t[i])
if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var r=0
for(i=Object.getOwnPropertySymbols(t);r<i.length;r++)e.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(t,i[r])&&(n[i[r]]=t[i[r]])}return n}function o(t){var e="function"==typeof Symbol&&Symbol.iterator,n=e&&t[e],i=0
if(n)return n.call(t)
if(t&&"number"==typeof t.length)return{next:function(){return t&&i>=t.length&&(t=void 0),{value:t&&t[i++],done:!t}}}
throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function a(t,e){var n="function"==typeof Symbol&&t[Symbol.iterator]
if(!n)return t
var i,r,o=n.call(t),a=[]
try{for(;(void 0===e||e-- >0)&&!(i=o.next()).done;)a.push(i.value)}catch(t){r={error:t}}finally{try{i&&!i.done&&(n=o.return)&&n.call(o)}finally{if(r)throw r.error}}return a}function s(t,e,n){if(n||2===arguments.length)for(var i,r=0,o=e.length;r<o;r++)!i&&r in e||(i||(i=Array.prototype.slice.call(e,0,r)),i[r]=e[r])
return t.concat(i||Array.prototype.slice.call(e))}},984:(t,e,n)=>{n.r(e),n.d(e,{after:()=>f,assign:()=>h,cancel:()=>c,choose:()=>x,doneState:()=>l,error:()=>m,errorExecution:()=>y,errorPlatform:()=>g,init:()=>p,invoke:()=>v,log:()=>d,nullEvent:()=>u,pure:()=>w,raise:()=>a,send:()=>s,start:()=>r,stop:()=>o,update:()=>b})
var i=n(228),r=i.M.Start,o=i.M.Stop,a=i.M.Raise,s=i.M.Send,c=i.M.Cancel,u=i.M.NullEvent,h=i.M.Assign,f=i.M.After,l=i.M.DoneState,d=i.M.Log,p=i.M.Init,v=i.M.Invoke,y=i.M.ErrorExecution,g=i.M.ErrorPlatform,m=i.M.ErrorCustom,b=i.M.Update,x=i.M.Choose,w=i.M.Pure},804:(t,e,n)=>{n.r(e),n.d(e,{actionTypes:()=>o,after:()=>T,assign:()=>M,cancel:()=>E,choose:()=>I,done:()=>N,doneInvoke:()=>C,error:()=>P,escalate:()=>H,forwardTo:()=>D,getActionFunction:()=>u,initEvent:()=>c,isActionObject:()=>j,log:()=>S,pure:()=>R,raise:()=>d,resolveActions:()=>X,resolveLog:()=>_,resolveRaise:()=>p,resolveSend:()=>y,resolveStop:()=>k,respond:()=>x,send:()=>v,sendParent:()=>g,sendTo:()=>m,sendUpdate:()=>b,start:()=>A,stop:()=>O,toActionObject:()=>h,toActionObjects:()=>f,toActivityDefinition:()=>l})
var i=n(432),r=n(228),o=n(984),a=n(861),s=n(197),c=(0,a.g5)({type:o.init})
function u(t,e){return e&&e[t]||void 0}function h(t,e){var n
if((0,a.HD)(t)||"number"==typeof t){var r=u(t,e)
n=(0,a.mf)(r)?{type:t,exec:r}:r||{type:t,exec:void 0}}else if((0,a.mf)(t))n={type:t.name||t.toString(),exec:t}
else if(r=u(t.type,e),(0,a.mf)(r))n=(0,i.pi)((0,i.pi)({},t),{exec:r})
else if(r){var o=r.type||t.type
n=(0,i.pi)((0,i.pi)((0,i.pi)({},r),t),{type:o})}else n=t
return n}var f=function(t,e){return t?((0,a.kJ)(t)?t:[t]).map((function(t){return h(t,e)})):[]}
function l(t){var e=h(t)
return(0,i.pi)((0,i.pi)({id:(0,a.HD)(t)?t:e.id},e),{type:e.type})}function d(t){return(0,a.HD)(t)?{type:o.raise,event:t}:v(t,{to:r.K.Internal})}function p(t){return{type:o.raise,_event:(0,a.g5)(t.event)}}function v(t,e){return{to:e?e.to:void 0,type:o.send,event:(0,a.mf)(t)?t:(0,a._v)(t),delay:e?e.delay:void 0,id:e&&void 0!==e.id?e.id:(0,a.mf)(t)?t.name:(0,a.x6)(t)}}function y(t,e,n,r){var o,s={_event:n},c=(0,a.g5)((0,a.mf)(t.event)?t.event(e,n.data,s):t.event)
if((0,a.HD)(t.delay)){var u=r&&r[t.delay]
o=(0,a.mf)(u)?u(e,n.data,s):u}else o=(0,a.mf)(t.delay)?t.delay(e,n.data,s):t.delay
var h=(0,a.mf)(t.to)?t.to(e,n.data,s):t.to
return(0,i.pi)((0,i.pi)({},t),{to:h,_event:c,event:c.data,delay:o})}function g(t,e){return v(t,(0,i.pi)((0,i.pi)({},e),{to:r.K.Parent}))}function m(t,e,n){return v(e,(0,i.pi)((0,i.pi)({},n),{to:t}))}function b(){return g(o.update)}function x(t,e){return v(t,(0,i.pi)((0,i.pi)({},e),{to:function(t,e,n){return n._event.origin}}))}var w=function(t,e){return{context:t,event:e}}
function S(t,e){return void 0===t&&(t=w),{type:o.log,label:e,expr:t}}var _=function(t,e,n){return(0,i.pi)((0,i.pi)({},t),{value:(0,a.HD)(t.expr)?t.expr:t.expr(e,n.data,{_event:n})})},E=function(t){return{type:o.cancel,sendId:t}}
function A(t){var e=l(t)
return{type:r.M.Start,activity:e,exec:void 0}}function O(t){var e=(0,a.mf)(t)?t:l(t)
return{type:r.M.Stop,activity:e,exec:void 0}}function k(t,e,n){var i=(0,a.mf)(t.activity)?t.activity(e,n.data):t.activity,o="string"==typeof i?{id:i}:i
return{type:r.M.Stop,activity:o}}var M=function(t){return{type:o.assign,assignment:t}}
function j(t){return"object"==typeof t&&"type"in t}function T(t,e){var n=e?"#".concat(e):""
return"".concat(r.M.After,"(").concat(t,")").concat(n)}function N(t,e){var n="".concat(r.M.DoneState,".").concat(t)
return{type:n,data:e,toString:function(){return n}}}function C(t,e){var n="".concat(r.M.DoneInvoke,".").concat(t)
return{type:n,data:e,toString:function(){return n}}}function P(t,e){var n="".concat(r.M.ErrorPlatform,".").concat(t)
return{type:n,data:e,toString:function(){return n}}}function R(t){return{type:r.M.Pure,get:t}}function D(t,e){if(!(s.M||t&&"function"!=typeof t)){var n=t
t=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e]
var r="function"==typeof n?n.apply(void 0,(0,i.ev)([],(0,i.CR)(t),!1)):n
if(!r)throw new Error("Attempted to forward event to undefined actor. This risks an infinite loop in the sender.")
return r}}return v((function(t,e){return e}),(0,i.pi)((0,i.pi)({},e),{to:t}))}function H(t,e){return g((function(e,n,i){return{type:o.error,data:(0,a.mf)(t)?t(e,n,i):t}}),(0,i.pi)((0,i.pi)({},e),{to:r.K.Parent}))}function I(t){return{type:r.M.Choose,conds:t}}function X(t,e,n,c,u,l,d){void 0===d&&(d=!1)
var v=d?[]:function(t){var e,n,r=[]
try{for(var a=(0,i.XA)(t),s=a.next();!s.done;s=a.next())for(var c=s.value,u=0;u<c.length;)c[u].type!==o.assign?u++:(r.push(c[u]),c.splice(u,1))}catch(t){e={error:t}}finally{try{s&&!s.done&&(n=a.return)&&n.call(a)}finally{if(e)throw e.error}}return r}(u),g=v.length?(0,a.dt)(n,c,v,e):n,m=d?[n]:void 0,b=[]
function x(u){var v
switch(u.type){case o.raise:return p(u)
case o.send:var x=y(u,g,c,t.options.delays)
return s.M||(0,a.ZK)(!(0,a.HD)(u.delay)||"number"==typeof x.delay,"No delay reference for delay expression '".concat(u.delay,"' was found on machine '").concat(t.id,"'")),l&&x.to!==r.K.Internal&&b.push(x),x
case o.log:var w=_(u,g,c)
return null==l||l(w,g,c),w
case o.choose:if(!(O=null===(v=u.conds.find((function(n){var i=(0,a.Qi)(n.cond,t.options.guards)
return!i||(0,a.vx)(t,i,g,c,l?void 0:e)})))||void 0===v?void 0:v.actions))return[]
var S=(0,i.CR)(X(t,e,g,c,[f((0,a.qo)(O),t.options.actions)],l,d),2),E=S[0],A=S[1]
return g=A,null==m||m.push(g),E
case o.pure:var O
if(!(O=u.get(g,c.data)))return[]
var M=(0,i.CR)(X(t,e,g,c,[f((0,a.qo)(O),t.options.actions)],l,d),2),j=M[0],T=M[1]
return g=T,null==m||m.push(g),j
case o.stop:return w=k(u,g,c),null==l||l(w,n,c),w
case o.assign:g=(0,a.dt)(g,c,[u],l?void 0:e),null==m||m.push(g)
break
default:var N=h(u,t.options.actions),C=N.exec
if(l)l(N,g,c)
else if(C&&m){var P=m.length-1
N=(0,i.pi)((0,i.pi)({},N),{exec:function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n]
C.apply(void 0,(0,i.ev)([m[P]],(0,i.CR)(e),!1))}})}return N}}return[(0,a.xH)(u.map((function(t){var e,n,r=[]
try{for(var o=(0,i.XA)(t),a=o.next();!a.done;a=o.next()){var s=x(a.value)
s&&(r=r.concat(s))}}catch(t){e={error:t}}finally{try{a&&!a.done&&(n=o.return)&&n.call(o)}finally{if(e)throw e.error}}return b.forEach((function(t){l(t,g,c)})),b.length=0,r}))),g]}},634:(t,e,n)=>{n.d(e,{YP:()=>o})
var i=n(464),r=n(861)
function o(t,e){void 0===e&&(e={})
var n=t.initialState,o=new Set,a=[],s=!1,c=(0,i.vk)({id:e.id,send:function(e){a.push(e),function(){if(!s){for(s=!0;a.length>0;){var e=a.shift()
n=t.transition(n,e,u),o.forEach((function(t){return t.next(n)}))}s=!1}}()},getSnapshot:function(){return n},subscribe:function(t,e,i){var a=(0,r.zM)(t,e,i)
return o.add(a),a.next(n),{unsubscribe:function(){o.delete(a)}}}}),u={parent:e.parent,self:c,id:e.id||"anonymous",observers:o}
return n=t.start?t.start(u):n,c}},34:(t,e,n)=>{n.d(e,{TV:()=>o,iS:()=>i,qP:()=>r,rt:()=>a})
var i=".",r={},o="xstate.guard",a=""},197:(t,e,n)=>{n.d(e,{M:()=>i})
var i=!0},549:(t,e,n)=>{n.r(e),n.d(e,{ActionTypes:()=>c.M,Interpreter:()=>o.Ng,InterpreterStatus:()=>o.TM,Machine:()=>w,SpecialTargets:()=>c.K,State:()=>u.ZM,StateNode:()=>b,actions:()=>i,assign:()=>M,createMachine:()=>S,createSchema:()=>A,doneInvoke:()=>R,forwardTo:()=>P,interpret:()=>o.kJ,mapState:()=>_,matchState:()=>E,matchesState:()=>s.W,raise:()=>D,send:()=>j,sendParent:()=>N,sendTo:()=>T,sendUpdate:()=>C,spawn:()=>o.Cs,spawnBehavior:()=>k.YP,t:()=>O,toActorRef:()=>r.vk,toEventObject:()=>s._v,toObserver:()=>s.zM,toSCXMLEvent:()=>s.g5})
var i=n(804),r=n(464),o=n(504),a=n(432),s=n(861),c=n(228),u=n(569),h=n(984),f=n(197),l=n(34),d=n(215)
function p(t){return(0,a.pi)((0,a.pi)({type:h.invoke},t),{toJSON:function(){t.onDone,t.onError
var e,n=(0,a._T)(t,["onDone","onError"])
return(0,a.pi)((0,a.pi)({},n),{type:h.invoke,src:(e=t.src,"string"==typeof e?{type:e,toString:function(){return e}}:e)})}})}var v="",y="*",g={},m=function(t){return"#"===t[0]},b=function(){function t(e,n,r,o){void 0===r&&(r="context"in e?e.context:void 0)
var c,u=this
this.config=e,this._context=r,this.order=-1,this.__xstatenode=!0,this.__cache={events:void 0,relativeValue:new Map,initialStateValue:void 0,initialState:void 0,on:void 0,transitions:void 0,candidates:{},delayedTransitions:void 0},this.idMap={},this.tags=[],this.options=Object.assign({actions:{},guards:{},services:{},activities:{},delays:{}},n),this.parent=null==o?void 0:o.parent,this.key=this.config.key||(null==o?void 0:o.key)||this.config.id||"(machine)",this.machine=this.parent?this.parent.machine:this,this.path=this.parent?this.parent.path.concat(this.key):[],this.delimiter=this.config.delimiter||(this.parent?this.parent.delimiter:l.iS),this.id=this.config.id||(0,a.ev)([this.machine.key],(0,a.CR)(this.path),!1).join(this.delimiter),this.version=this.parent?this.parent.version:this.config.version,this.type=this.config.type||(this.config.parallel?"parallel":this.config.states&&Object.keys(this.config.states).length?"compound":this.config.history?"history":"atomic"),this.schema=this.parent?this.machine.schema:null!==(c=this.config.schema)&&void 0!==c?c:{},this.description=this.config.description,f.M||(0,s.ZK)(!("parallel"in this.config),'The "parallel" property is deprecated and will be removed in version 4.1. '.concat(this.config.parallel?"Replace with `type: 'parallel'`":"Use `type: '".concat(this.type,"'`")," in the config for state node '").concat(this.id,"' instead.")),this.initial=this.config.initial,this.states=this.config.states?(0,s.Q8)(this.config.states,(function(e,n){var i,r=new t(e,{},void 0,{parent:u,key:n})
return Object.assign(u.idMap,(0,a.pi)(((i={})[r.id]=r,i),r.idMap)),r})):g
var h=0
!function t(e){var n,i
e.order=h++
try{for(var r=(0,a.XA)((0,d.nI)(e)),o=r.next();!o.done;o=r.next())t(o.value)}catch(t){n={error:t}}finally{try{o&&!o.done&&(i=r.return)&&i.call(r)}finally{if(n)throw n.error}}}(this),this.history=!0===this.config.history?"shallow":this.config.history||!1,this._transient=!!this.config.always||!!this.config.on&&(Array.isArray(this.config.on)?this.config.on.some((function(t){return t.event===v})):v in this.config.on),this.strict=!!this.config.strict,this.onEntry=(0,s.qo)(this.config.entry||this.config.onEntry).map((function(t){return(0,i.toActionObject)(t)})),this.onExit=(0,s.qo)(this.config.exit||this.config.onExit).map((function(t){return(0,i.toActionObject)(t)})),this.meta=this.config.meta,this.doneData="final"===this.type?this.config.data:void 0,this.invoke=(0,s.qo)(this.config.invoke).map((function(t,e){var n,i
if((0,s.O4)(t)){var r=(0,s.bx)(u.id,e)
return u.machine.options.services=(0,a.pi)(((n={})[r]=t,n),u.machine.options.services),p({src:r,id:r})}if((0,s.HD)(t.src))return r=t.id||(0,s.bx)(u.id,e),p((0,a.pi)((0,a.pi)({},t),{id:r,src:t.src}))
if((0,s.O4)(t.src)||(0,s.mf)(t.src))return r=t.id||(0,s.bx)(u.id,e),u.machine.options.services=(0,a.pi)(((i={})[r]=t.src,i),u.machine.options.services),p((0,a.pi)((0,a.pi)({id:r},t),{src:r}))
var o=t.src
return p((0,a.pi)((0,a.pi)({id:(0,s.bx)(u.id,e)},t),{src:o}))})),this.activities=(0,s.qo)(this.config.activities).concat(this.invoke).map((function(t){return(0,i.toActivityDefinition)(t)})),this.transition=this.transition.bind(this),this.tags=(0,s.qo)(this.config.tags)}return t.prototype._init=function(){this.__cache.transitions||(0,d.ac)(this).forEach((function(t){return t.on}))},t.prototype.withConfig=function(e,n){var i=this.options,r=i.actions,o=i.activities,s=i.guards,c=i.services,u=i.delays
return new t(this.config,{actions:(0,a.pi)((0,a.pi)({},r),e.actions),activities:(0,a.pi)((0,a.pi)({},o),e.activities),guards:(0,a.pi)((0,a.pi)({},s),e.guards),services:(0,a.pi)((0,a.pi)({},c),e.services),delays:(0,a.pi)((0,a.pi)({},u),e.delays)},null!=n?n:this.context)},t.prototype.withContext=function(e){return new t(this.config,this.options,e)},Object.defineProperty(t.prototype,"context",{get:function(){return(0,s.mf)(this._context)?this._context():this._context},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"definition",{get:function(){return{id:this.id,key:this.key,version:this.version,context:this.context,type:this.type,initial:this.initial,history:this.history,states:(0,s.Q8)(this.states,(function(t){return t.definition})),on:this.on,transitions:this.transitions,entry:this.onEntry,exit:this.onExit,activities:this.activities||[],meta:this.meta,order:this.order||-1,data:this.doneData,invoke:this.invoke,description:this.description,tags:this.tags}},enumerable:!1,configurable:!0}),t.prototype.toJSON=function(){return this.definition},Object.defineProperty(t.prototype,"on",{get:function(){if(this.__cache.on)return this.__cache.on
var t=this.transitions
return this.__cache.on=t.reduce((function(t,e){return t[e.eventType]=t[e.eventType]||[],t[e.eventType].push(e),t}),{})},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"after",{get:function(){return this.__cache.delayedTransitions||(this.__cache.delayedTransitions=this.getDelayedTransitions(),this.__cache.delayedTransitions)},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"transitions",{get:function(){return this.__cache.transitions||(this.__cache.transitions=this.formatTransitions(),this.__cache.transitions)},enumerable:!1,configurable:!0}),t.prototype.getCandidates=function(t){if(this.__cache.candidates[t])return this.__cache.candidates[t]
var e=t===v,n=this.transitions.filter((function(n){var i=n.eventType===t
return e?i:i||n.eventType===y}))
return this.__cache.candidates[t]=n,n},t.prototype.getDelayedTransitions=function(){var t=this,e=this.config.after
if(!e)return[]
var n=function(e,n){var r=(0,s.mf)(e)?"".concat(t.id,":delay[").concat(n,"]"):e,o=(0,i.after)(r,t.id)
return t.onEntry.push((0,i.send)(o,{delay:e})),t.onExit.push((0,i.cancel)(o)),o}
return((0,s.kJ)(e)?e.map((function(t,e){var i=n(t.delay,e)
return(0,a.pi)((0,a.pi)({},t),{event:i})})):(0,s.xH)(Object.keys(e).map((function(t,i){var r=e[t],o=(0,s.HD)(r)?{target:r}:r,c=isNaN(+t)?t:+t,u=n(c,i)
return(0,s.qo)(o).map((function(t){return(0,a.pi)((0,a.pi)({},t),{event:u,delay:c})}))})))).map((function(e){var n=e.delay
return(0,a.pi)((0,a.pi)({},t.formatTransition(e)),{delay:n})}))},t.prototype.getStateNodes=function(t){var e,n=this
if(!t)return[]
var i=t instanceof u.ZM?t.value:(0,s.WM)(t,this.delimiter)
if((0,s.HD)(i)){var r=this.getStateNode(i).initial
return void 0!==r?this.getStateNodes(((e={})[i]=r,e)):[this,this.states[i]]}var o=Object.keys(i),c=[this]
return c.push.apply(c,(0,a.ev)([],(0,a.CR)((0,s.xH)(o.map((function(t){return n.getStateNode(t).getStateNodes(i[t])})))),!1)),c},t.prototype.handles=function(t){var e=(0,s.x6)(t)
return this.events.includes(e)},t.prototype.resolveState=function(t){var e=t instanceof u.ZM?t:u.ZM.create(t),n=Array.from((0,d.P_)([],this.getStateNodes(e.value)))
return new u.ZM((0,a.pi)((0,a.pi)({},e),{value:this.resolve(e.value),configuration:n,done:(0,d.Ij)(n,this),tags:(0,d.Oe)(n),machine:this.machine}))},t.prototype.transitionLeafNode=function(t,e,n){var i=this.getStateNode(t).next(e,n)
return i&&i.transitions.length?i:this.next(e,n)},t.prototype.transitionCompoundNode=function(t,e,n){var i=Object.keys(t),r=this.getStateNode(i[0])._transition(t[i[0]],e,n)
return r&&r.transitions.length?r:this.next(e,n)},t.prototype.transitionParallelNode=function(t,e,n){var i,r,o={}
try{for(var c=(0,a.XA)(Object.keys(t)),u=c.next();!u.done;u=c.next()){var h=u.value,f=t[h]
if(f){var l=this.getStateNode(h)._transition(f,e,n)
l&&(o[h]=l)}}}catch(t){i={error:t}}finally{try{u&&!u.done&&(r=c.return)&&r.call(c)}finally{if(i)throw i.error}}var d=Object.keys(o).map((function(t){return o[t]})),p=(0,s.xH)(d.map((function(t){return t.transitions})))
if(!d.some((function(t){return t.transitions.length>0})))return this.next(e,n)
var v=(0,s.xH)(d.map((function(t){return t.entrySet}))),y=(0,s.xH)(Object.keys(o).map((function(t){return o[t].configuration})))
return{transitions:p,entrySet:v,exitSet:(0,s.xH)(d.map((function(t){return t.exitSet}))),configuration:y,source:e,actions:(0,s.xH)(Object.keys(o).map((function(t){return o[t].actions})))}},t.prototype._transition=function(t,e,n){return(0,s.HD)(t)?this.transitionLeafNode(t,e,n):1===Object.keys(t).length?this.transitionCompoundNode(t,e,n):this.transitionParallelNode(t,e,n)},t.prototype.getTransitionData=function(t,e){return this._transition(t.value,t,(0,s.g5)(e))},t.prototype.next=function(t,e){var n,i,r,o=this,c=e.name,u=[],h=[]
try{for(var f=(0,a.XA)(this.getCandidates(c)),l=f.next();!l.done;l=f.next()){var d=l.value,p=d.cond,v=d.in,y=t.context,g=!v||((0,s.HD)(v)&&m(v)?t.matches((0,s.WM)(this.getStateNodeById(v).path,this.delimiter)):(0,s.W)((0,s.WM)(v,this.delimiter),(0,s.ET)(this.path.slice(0,-2))(t.value))),b=!1
try{b=!p||(0,s.vx)(this.machine,p,y,e,t)}catch(t){throw new Error("Unable to evaluate guard '".concat(p.name||p.type,"' in transition for event '").concat(c,"' in state node '").concat(this.id,"':\n").concat(t.message))}if(b&&g){void 0!==d.target&&(h=d.target),u.push.apply(u,(0,a.ev)([],(0,a.CR)(d.actions),!1)),r=d
break}}}catch(t){n={error:t}}finally{try{l&&!l.done&&(i=f.return)&&i.call(f)}finally{if(n)throw n.error}}if(r){if(!h.length)return{transitions:[r],entrySet:[],exitSet:[],configuration:t.value?[this]:[],source:t,actions:u}
var x=(0,s.xH)(h.map((function(e){return o.getRelativeStateNodes(e,t.historyValue)}))),w=!!r.internal,S=[]
return w||h.forEach((function(t){S.push.apply(S,(0,a.ev)([],(0,a.CR)(o.getExternalReentryNodes(t)),!1))})),{transitions:[r],entrySet:S,exitSet:w?[]:[this],configuration:x,source:t,actions:u}}},t.prototype.getExternalReentryNodes=function(t){for(var e=[],n=(0,a.CR)(t.order>this.order?[t,this]:[this,t],2),i=n[0],r=n[1];i&&i!==r;)e.push(i),i=i.parent
return i!==r?[]:(e.push(r),e)},t.prototype.getActions=function(t,e,n,r,o,u,f){var l,p,v,y,g=this,m=(0,d.P_)([],u?this.getStateNodes(u.value):[this])
try{for(var b=(0,a.XA)(t),x=b.next();!x.done;x=b.next()){var w=x.value;(!(0,d.e$)(m,w)||(0,d.e$)(n.entrySet,w.parent)&&!(0,d.e$)(n.entrySet,w))&&n.entrySet.push(w)}}catch(t){l={error:t}}finally{try{x&&!x.done&&(p=b.return)&&p.call(b)}finally{if(l)throw l.error}}try{for(var S=(0,a.XA)(m),_=S.next();!_.done;_=S.next())w=_.value,(0,d.e$)(t,w)&&!(0,d.e$)(n.exitSet,w.parent)||n.exitSet.push(w)}catch(t){v={error:t}}finally{try{_&&!_.done&&(y=S.return)&&y.call(S)}finally{if(v)throw v.error}}var E=(0,s.xH)(n.entrySet.map((function(t){var e=[]
if("final"!==t.type)return e
var a=t.parent
if(!a.parent)return e
e.push((0,i.done)(t.id,t.doneData),(0,i.done)(a.id,t.doneData?(0,s.QX)(t.doneData,r,o):void 0))
var c=a.parent
return"parallel"===c.type&&(0,d.G)(c).every((function(t){return(0,d.Ij)(n.configuration,t)}))&&e.push((0,i.done)(c.id)),e})))
n.exitSet.sort((function(t,e){return e.order-t.order})),n.entrySet.sort((function(t,e){return t.order-e.order}))
var A=new Set(n.entrySet),O=new Set(n.exitSet),k=Array.from(A).map((function(t){var e=t.onEntry,n=t.activities.map((function(t){return(0,i.start)(t)}))
return(0,i.toActionObjects)(f?(0,a.ev)((0,a.ev)([],(0,a.CR)(e),!1),(0,a.CR)(n),!1):(0,a.ev)((0,a.ev)([],(0,a.CR)(n),!1),(0,a.CR)(e),!1),g.machine.options.actions)})).concat([E.map(i.raise)]),M=Array.from(O).map((function(t){return(0,i.toActionObjects)((0,a.ev)((0,a.ev)([],(0,a.CR)(t.onExit),!1),(0,a.CR)(t.activities.map((function(t){return(0,i.stop)(t)}))),!1),g.machine.options.actions)})).concat([(0,i.toActionObjects)(n.actions,this.machine.options.actions)]).concat(k)
if(e){var j=(0,i.toActionObjects)((0,s.xH)((0,a.ev)([],(0,a.CR)(t),!1).sort((function(t,e){return e.order-t.order})).map((function(t){return t.onExit}))),this.machine.options.actions).filter((function(t){return t.type!==h.raise&&(t.type!==h.send||!!t.to&&t.to!==c.K.Internal)}))
return M.concat([j])}return M},t.prototype.transition=function(t,e,n,i){void 0===t&&(t=this.initialState)
var r,o=(0,s.g5)(e)
if(t instanceof u.ZM)r=void 0===n?t:this.resolveState(u.ZM.from(t,n))
else{var c=(0,s.HD)(t)?this.resolve((0,s.on)(this.getResolvedPath(t))):this.resolve(t),h=null!=n?n:this.machine.context
r=this.resolveState(u.ZM.from(c,h))}if(!f.M&&o.name===y)throw new Error("An event cannot have the wildcard type ('".concat(y,"')"))
if(this.strict&&!this.events.includes(o.name)&&!(0,s.JQ)(o.name))throw new Error("Machine '".concat(this.id,"' does not accept event '").concat(o.name,"'"))
var l=this._transition(r.value,r,o)||{transitions:[],configuration:[],entrySet:[],exitSet:[],source:r,actions:[]},p=(0,d.P_)([],this.getStateNodes(r.value)),v=l.configuration.length?(0,d.P_)(p,l.configuration):p
return l.configuration=(0,a.ev)([],(0,a.CR)(v),!1),this.resolveTransition(l,r,r.context,i,o)},t.prototype.resolveRaisedTransition=function(t,e,n,i){var r,o=t.actions
return(t=this.transition(t,e,void 0,i))._event=n,t.event=n.data,(r=t.actions).unshift.apply(r,(0,a.ev)([],(0,a.CR)(o),!1)),t},t.prototype.resolveTransition=function(t,e,n,o,f){var l,p,y,g,m=this
void 0===f&&(f=i.initEvent)
var b=t.configuration,x=!e||t.transitions.length>0,w=x?t.configuration:e?e.configuration:[],S=(0,d.Ij)(w,this),_=x?(0,d.NA)(this.machine,b):void 0,E=e?e.historyValue?e.historyValue:t.source?this.machine.historyValue(e.value):void 0:void 0,A=this.getActions(new Set(w),S,t,n,f,e,o),O=e?(0,a.pi)({},e.activities):{}
try{for(var k=(0,a.XA)(A),M=k.next();!M.done;M=k.next()){var j=M.value
try{for(var T=(y=void 0,(0,a.XA)(j)),N=T.next();!N.done;N=T.next()){var C=N.value
C.type===h.start?O[C.activity.id||C.activity.type]=C:C.type===h.stop&&(O[C.activity.id||C.activity.type]=!1)}}catch(t){y={error:t}}finally{try{N&&!N.done&&(g=T.return)&&g.call(T)}finally{if(y)throw y.error}}}}catch(t){l={error:t}}finally{try{M&&!M.done&&(p=k.return)&&p.call(k)}finally{if(l)throw l.error}}var P=(0,a.CR)((0,i.resolveActions)(this,e,n,f,A,o,this.machine.config.predictableActionArguments||this.machine.config.preserveActionOrder),2),R=P[0],D=P[1],H=(0,a.CR)((0,s.uK)(R,(function(t){return t.type===h.raise||t.type===h.send&&t.to===c.K.Internal})),2),I=H[0],X=H[1],L=R.filter((function(t){var e
return t.type===h.start&&(null===(e=t.activity)||void 0===e?void 0:e.type)===h.invoke})),V=L.reduce((function(t,e){return t[e.activity.id]=(0,r.mu)(e.activity,m.machine,D,f),t}),e?(0,a.pi)({},e.children):{}),Z=new u.ZM({value:_||e.value,context:D,_event:f,_sessionid:e?e._sessionid:null,historyValue:_?E?(0,s.yv)(E,_):void 0:e?e.historyValue:void 0,history:!_||t.source?e:void 0,actions:_?X:[],activities:_?O:e?e.activities:{},events:[],configuration:w,transitions:t.transitions,children:V,done:S,tags:(0,d.Oe)(w),machine:this}),K=n!==D
Z.changed=f.name===h.update||K
var J=Z.history
J&&delete J.history
var z=!S&&(this._transient||b.some((function(t){return t._transient})))
if(!(x||z&&f.name!==v))return Z
var Q=Z
if(!S)for(z&&(Q=this.resolveRaisedTransition(Q,{type:h.nullEvent},f,o));I.length;){var $=I.shift()
Q=this.resolveRaisedTransition(Q,$._event,f,o)}var q=Q.changed||(J?!!Q.actions.length||K||typeof J.value!=typeof Q.value||!(0,u.j_)(Q.value,J.value):void 0)
return Q.changed=q,Q.history=J,Q},t.prototype.getStateNode=function(t){if(m(t))return this.machine.getStateNodeById(t)
if(!this.states)throw new Error("Unable to retrieve child state '".concat(t,"' from '").concat(this.id,"'; no child states exist."))
var e=this.states[t]
if(!e)throw new Error("Child state '".concat(t,"' does not exist on '").concat(this.id,"'"))
return e},t.prototype.getStateNodeById=function(t){var e=m(t)?t.slice("#".length):t
if(e===this.id)return this
var n=this.machine.idMap[e]
if(!n)throw new Error("Child state node '#".concat(e,"' does not exist on machine '").concat(this.id,"'"))
return n},t.prototype.getStateNodeByPath=function(t){if("string"==typeof t&&m(t))try{return this.getStateNodeById(t.slice(1))}catch(t){}for(var e=(0,s.Q9)(t,this.delimiter).slice(),n=this;e.length;){var i=e.shift()
if(!i.length)break
n=n.getStateNode(i)}return n},t.prototype.resolve=function(t){var e,n=this
if(!t)return this.initialStateValue||g
switch(this.type){case"parallel":return(0,s.Q8)(this.initialStateValue,(function(e,i){return e?n.getStateNode(i).resolve(t[i]||e):g}))
case"compound":if((0,s.HD)(t)){var i=this.getStateNode(t)
return"parallel"===i.type||"compound"===i.type?((e={})[t]=i.initialStateValue,e):t}return Object.keys(t).length?(0,s.Q8)(t,(function(t,e){return t?n.getStateNode(e).resolve(t):g})):this.initialStateValue||{}
default:return t||g}},t.prototype.getResolvedPath=function(t){if(m(t)){var e=this.machine.idMap[t.slice("#".length)]
if(!e)throw new Error("Unable to find state node '".concat(t,"'"))
return e.path}return(0,s.Q9)(t,this.delimiter)},Object.defineProperty(t.prototype,"initialStateValue",{get:function(){var t,e
if(this.__cache.initialStateValue)return this.__cache.initialStateValue
if("parallel"===this.type)e=(0,s.ib)(this.states,(function(t){return t.initialStateValue||g}),(function(t){return!("history"===t.type)}))
else if(void 0!==this.initial){if(!this.states[this.initial])throw new Error("Initial state '".concat(this.initial,"' not found on '").concat(this.key,"'"))
e=(0,d.N9)(this.states[this.initial])?this.initial:((t={})[this.initial]=this.states[this.initial].initialStateValue,t)}else e={}
return this.__cache.initialStateValue=e,this.__cache.initialStateValue},enumerable:!1,configurable:!0}),t.prototype.getInitialState=function(t,e){this._init()
var n=this.getStateNodes(t)
return this.resolveTransition({configuration:n,entrySet:n,exitSet:[],transitions:[],source:void 0,actions:[]},void 0,null!=e?e:this.machine.context,void 0)},Object.defineProperty(t.prototype,"initialState",{get:function(){var t=this.initialStateValue
if(!t)throw new Error("Cannot retrieve initial state from simple state '".concat(this.id,"'."))
return this.getInitialState(t)},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"target",{get:function(){var t
if("history"===this.type){var e=this.config
t=(0,s.HD)(e.target)&&m(e.target)?(0,s.on)(this.machine.getStateNodeById(e.target).path.slice(this.path.length-1)):e.target}return t},enumerable:!1,configurable:!0}),t.prototype.getRelativeStateNodes=function(t,e,n){return void 0===n&&(n=!0),n?"history"===t.type?t.resolveHistory(e):t.initialStateNodes:[t]},Object.defineProperty(t.prototype,"initialStateNodes",{get:function(){var t=this
if((0,d.N9)(this))return[this]
if("compound"===this.type&&!this.initial)return f.M||(0,s.ZK)(!1,"Compound state node '".concat(this.id,"' has no initial state.")),[this]
var e=(0,s.SA)(this.initialStateValue)
return(0,s.xH)(e.map((function(e){return t.getFromRelativePath(e)})))},enumerable:!1,configurable:!0}),t.prototype.getFromRelativePath=function(t){if(!t.length)return[this]
var e=(0,a.CR)(t),n=e[0],i=e.slice(1)
if(!this.states)throw new Error("Cannot retrieve subPath '".concat(n,"' from node with no states"))
var r=this.getStateNode(n)
if("history"===r.type)return r.resolveHistory()
if(!this.states[n])throw new Error("Child state '".concat(n,"' does not exist on '").concat(this.id,"'"))
return this.states[n].getFromRelativePath(i)},t.prototype.historyValue=function(t){if(Object.keys(this.states).length)return{current:t||this.initialStateValue,states:(0,s.ib)(this.states,(function(e,n){if(!t)return e.historyValue()
var i=(0,s.HD)(t)?void 0:t[n]
return e.historyValue(i||e.initialStateValue)}),(function(t){return!t.history}))}},t.prototype.resolveHistory=function(t){var e=this
if("history"!==this.type)return[this]
var n=this.parent
if(!t){var i=this.target
return i?(0,s.xH)((0,s.SA)(i).map((function(t){return n.getFromRelativePath(t)}))):n.initialStateNodes}var r=(0,s.gk)(n.path,"states")(t).current
return(0,s.HD)(r)?[n.getStateNode(r)]:(0,s.xH)((0,s.SA)(r).map((function(t){return"deep"===e.history?n.getFromRelativePath(t):[n.states[t[0]]]})))},Object.defineProperty(t.prototype,"stateIds",{get:function(){var t=this,e=(0,s.xH)(Object.keys(this.states).map((function(e){return t.states[e].stateIds})))
return[this.id].concat(e)},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"events",{get:function(){var t,e,n,i
if(this.__cache.events)return this.__cache.events
var r=this.states,o=new Set(this.ownEvents)
if(r)try{for(var s=(0,a.XA)(Object.keys(r)),c=s.next();!c.done;c=s.next()){var u=r[c.value]
if(u.states)try{for(var h=(n=void 0,(0,a.XA)(u.events)),f=h.next();!f.done;f=h.next()){var l=f.value
o.add("".concat(l))}}catch(t){n={error:t}}finally{try{f&&!f.done&&(i=h.return)&&i.call(h)}finally{if(n)throw n.error}}}}catch(e){t={error:e}}finally{try{c&&!c.done&&(e=s.return)&&e.call(s)}finally{if(t)throw t.error}}return this.__cache.events=Array.from(o)},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"ownEvents",{get:function(){var t=new Set(this.transitions.filter((function(t){return!(!t.target&&!t.actions.length&&t.internal)})).map((function(t){return t.eventType})))
return Array.from(t)},enumerable:!1,configurable:!0}),t.prototype.resolveTarget=function(t){var e=this
if(void 0!==t)return t.map((function(t){if(!(0,s.HD)(t))return t
var n=t[0]===e.delimiter
if(n&&!e.parent)return e.getStateNodeByPath(t.slice(1))
var i=n?e.key+t:t
if(!e.parent)return e.getStateNodeByPath(i)
try{return e.parent.getStateNodeByPath(i)}catch(t){throw new Error("Invalid transition definition for state node '".concat(e.id,"':\n").concat(t.message))}}))},t.prototype.formatTransition=function(t){var e=this,n=(0,s.rg)(t.target),r="internal"in t?t.internal:!n||n.some((function(t){return(0,s.HD)(t)&&t[0]===e.delimiter})),o=this.machine.options.guards,c=this.resolveTarget(n),u=(0,a.pi)((0,a.pi)({},t),{actions:(0,i.toActionObjects)((0,s.qo)(t.actions)),cond:(0,s.Qi)(t.cond,o),target:c,source:this,internal:r,eventType:t.event,toJSON:function(){return(0,a.pi)((0,a.pi)({},u),{target:u.target?u.target.map((function(t){return"#".concat(t.id)})):void 0,source:"#".concat(e.id)})}})
return u},t.prototype.formatTransitions=function(){var t,e,n,r=this
if(this.config.on)if(Array.isArray(this.config.on))n=this.config.on
else{var o=this.config.on,c=o["*"],u=void 0===c?[]:c,h=(0,a._T)(o,["*"])
n=(0,s.xH)(Object.keys(h).map((function(t){f.M||t!==v||(0,s.ZK)(!1,"Empty string transition configs (e.g., `{ on: { '': ... }}`) for transient transitions are deprecated. Specify the transition in the `{ always: ... }` property instead. "+'Please check the `on` configuration for "#'.concat(r.id,'".'))
var e=(0,s.jh)(t,h[t])
return f.M||function(t,e,n){var i=n.slice(0,-1).some((function(t){return!("cond"in t)&&!("in"in t)&&((0,s.HD)(t.target)||(0,s.O4)(t.target))})),r=e===v?"the transient event":"event '".concat(e,"'");(0,s.ZK)(!i,"One or more transitions for ".concat(r," on state '").concat(t.id,"' are unreachable. ")+"Make sure that the default transition is the last one defined.")}(r,t,e),e})).concat((0,s.jh)(y,u)))}else n=[]
var l=this.config.always?(0,s.jh)("",this.config.always):[],d=this.config.onDone?(0,s.jh)(String((0,i.done)(this.id)),this.config.onDone):[]
f.M||(0,s.ZK)(!(this.config.onDone&&!this.parent),'Root nodes cannot have an ".onDone" transition. Please check the config of "'.concat(this.id,'".'))
var p=(0,s.xH)(this.invoke.map((function(t){var e=[]
return t.onDone&&e.push.apply(e,(0,a.ev)([],(0,a.CR)((0,s.jh)(String((0,i.doneInvoke)(t.id)),t.onDone)),!1)),t.onError&&e.push.apply(e,(0,a.ev)([],(0,a.CR)((0,s.jh)(String((0,i.error)(t.id)),t.onError)),!1)),e}))),g=this.after,m=(0,s.xH)((0,a.ev)((0,a.ev)((0,a.ev)((0,a.ev)([],(0,a.CR)(d),!1),(0,a.CR)(p),!1),(0,a.CR)(n),!1),(0,a.CR)(l),!1).map((function(t){return(0,s.qo)(t).map((function(t){return r.formatTransition(t)}))})))
try{for(var b=(0,a.XA)(g),x=b.next();!x.done;x=b.next()){var w=x.value
m.push(w)}}catch(e){t={error:e}}finally{try{x&&!x.done&&(e=b.return)&&e.call(b)}finally{if(t)throw t.error}}return m},t}(),x=!1
function w(t,e,n){return void 0===n&&(n=t.context),new b(t,e,n)}function S(t,e){return f.M||t.predictableActionArguments||x||(x=!0,console.warn("It is highly recommended to set `predictableActionArguments` to `true` when using `createMachine`. https://xstate.js.org/docs/guides/actions.html")),new b(t,e)}function _(t,e){var n,i,r
try{for(var o=(0,a.XA)(Object.keys(t)),c=o.next();!c.done;c=o.next()){var u=c.value;(0,s.W)(u,e)&&(!r||e.length>r.length)&&(r=u)}}catch(t){n={error:t}}finally{try{c&&!c.done&&(i=o.return)&&i.call(o)}finally{if(n)throw n.error}}return t[r]}function E(t,e,n){var i,r,o=u.ZM.from(t,t instanceof u.ZM?t.context:void 0)
try{for(var s=(0,a.XA)(e),c=s.next();!c.done;c=s.next()){var h=(0,a.CR)(c.value,2),f=h[0],l=h[1]
if(o.matches(f))return l(o)}}catch(t){i={error:t}}finally{try{c&&!c.done&&(r=s.return)&&r.call(s)}finally{if(i)throw i.error}}return n(o)}function A(t){return t}var O=A,k=n(634),M=i.assign,j=i.send,T=i.sendTo,N=i.sendParent,C=i.sendUpdate,P=i.forwardTo,R=i.doneInvoke,D=i.raise},504:(t,e,n)=>{n.d(e,{Ng:()=>x,TM:()=>y,kJ:()=>S,Cs:()=>w})
var i=n(432),r=n(228),o=n(569),a=n(984),s=n(804),c=n(197),u=n(861),h={deferEvents:!1},f=function(){function t(t){this.processingEvent=!1,this.queue=[],this.initialized=!1,this.options=(0,i.pi)((0,i.pi)({},h),t)}return t.prototype.initialize=function(t){if(this.initialized=!0,t){if(!this.options.deferEvents)return void this.schedule(t)
this.process(t)}this.flushEvents()},t.prototype.schedule=function(t){if(this.initialized&&!this.processingEvent){if(0!==this.queue.length)throw new Error("Event queue should be empty when it is not processing events")
this.process(t),this.flushEvents()}else this.queue.push(t)},t.prototype.clear=function(){this.queue=[]},t.prototype.flushEvents=function(){for(var t=this.queue.shift();t;)this.process(t),t=this.queue.shift()},t.prototype.process=function(t){this.processingEvent=!0
try{t()}catch(t){throw this.clear(),t}finally{this.processingEvent=!1}},t}(),l=n(464),d=new Map,p=0
function v(){return"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:void(c.M||console.warn("XState could not find a global object in this environment. Please let the maintainers know and raise an issue here: https://github.com/statelyai/xstate/issues"))}var y,g=n(500),m=n(634),b={sync:!1,autoForward:!1}
!function(t){t[t.NotStarted=0]="NotStarted",t[t.Running=1]="Running",t[t.Stopped=2]="Stopped"}(y||(y={}))
var x=function(){function t(e,n){void 0===n&&(n=t.defaultOptions)
var o=this
this.machine=e,this.delayedEventsMap={},this.listeners=new Set,this.contextListeners=new Set,this.stopListeners=new Set,this.doneListeners=new Set,this.eventListeners=new Set,this.sendListeners=new Set,this.initialized=!1,this.status=y.NotStarted,this.children=new Map,this.forwardTo=new Set,this._outgoingQueue=[],this.init=this.start,this.send=function(t,e){if((0,u.kJ)(t))return o.batch(t),o.state
var n=(0,u.g5)((0,u._v)(t,e))
if(o.status===y.Stopped)return c.M||(0,u.ZK)(!1,'Event "'.concat(n.name,'" was sent to stopped service "').concat(o.machine.id,'". This service has already reached its final state, and will not transition.\nEvent: ').concat(JSON.stringify(n.data))),o.state
if(o.status!==y.Running&&!o.options.deferEvents)throw new Error('Event "'.concat(n.name,'" was sent to uninitialized service "').concat(o.machine.id,'". Make sure .start() is called for this service, or set { deferEvents: true } in the service options.\nEvent: ').concat(JSON.stringify(n.data)))
return o.scheduler.schedule((function(){o.forward(n)
var t=o._nextState(n)
o.update(t,n)})),o._state},this.sendTo=function(t,e,n){var h=o.parent&&(e===r.K.Parent||o.parent.id===e),f=h?o.parent:(0,u.HD)(e)?o.children.get(e)||function(t){return d.get(t)}(e):(0,u.Bc)(e)?e:void 0
if(f)if("machine"in f){if(o.status!==y.Stopped||o.parent!==f||o.state.done){var l=(0,i.pi)((0,i.pi)({},t),{name:t.name===a.error?"".concat((0,s.error)(o.id)):t.name,origin:o.sessionId})
!n&&o.machine.config.predictableActionArguments?o._outgoingQueue.push([f,l]):f.send(l)}}else!n&&o.machine.config.predictableActionArguments?o._outgoingQueue.push([f,t.data]):f.send(t.data)
else{if(!h)throw new Error("Unable to send event to child '".concat(e,"' from service '").concat(o.id,"'."))
c.M||(0,u.ZK)(!1,"Service '".concat(o.id,"' has no parent: unable to send event ").concat(t.type))}},this._exec=function(t,e,n,i){void 0===i&&(i=o.machine.options.actions)
var h=t.exec||(0,s.getActionFunction)(t.type,i),f=(0,u.mf)(h)?h:h?h.exec:t.exec
if(f)try{return f(e,n.data,o.machine.config.predictableActionArguments?{action:t,_event:n}:{action:t,state:o.state,_event:n})}catch(t){throw o.parent&&o.parent.send({type:"xstate.error",data:t}),t}switch(t.type){case a.send:var l=t
if("number"==typeof l.delay)return void o.defer(l)
l.to?o.sendTo(l._event,l.to,n===s.initEvent):o.send(l._event)
break
case a.cancel:o.cancel(t.sendId)
break
case a.start:if(o.status!==y.Running)return
var d=t.activity
if(!o.machine.config.predictableActionArguments&&!o.state.activities[d.id||d.type])break
if(d.type===r.M.Invoke){var p=(0,u.j)(d.src),v=o.machine.options.services?o.machine.options.services[p.type]:void 0,g=d.id,m=d.data
c.M||(0,u.ZK)(!("forward"in d),"`forward` property is deprecated (found in invocation of '".concat(d.src,"' in in machine '").concat(o.machine.id,"'). ")+"Please use `autoForward` instead.")
var b="autoForward"in d?d.autoForward:!!d.forward
if(!v)return void(c.M||(0,u.ZK)(!1,"No service found for invocation '".concat(d.src,"' in machine '").concat(o.machine.id,"'.")))
var x=m?(0,u.QX)(m,e,n):void 0
if("string"==typeof v)return
var w=(0,u.mf)(v)?v(e,n.data,{data:x,src:p,meta:d.meta}):v
if(!w)return
var S=void 0;(0,u.O4)(w)&&(w=x?w.withContext(x):w,S={autoForward:b}),o.spawn(w,g,S)}else o.spawnActivity(d)
break
case a.stop:o.stopChild(t.activity.id)
break
case a.log:var _=t.label,E=t.value
_?o.logger(_,E):o.logger(E)
break
default:c.M||(0,u.ZK)(!1,"No implementation found for action type '".concat(t.type,"'"))}}
var h=(0,i.pi)((0,i.pi)({},t.defaultOptions),n),l=h.clock,v=h.logger,g=h.parent,m=h.id,b=void 0!==m?m:e.id
this.id=b,this.logger=v,this.clock=l,this.parent=g,this.options=h,this.scheduler=new f({deferEvents:this.options.deferEvents}),this.sessionId="x:".concat(p++)}return Object.defineProperty(t.prototype,"initialState",{get:function(){var t=this
return this._initialState?this._initialState:(0,g.J)(this,(function(){return t._initialState=t.machine.initialState,t._initialState}))},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"state",{get:function(){return c.M||(0,u.ZK)(this.status!==y.NotStarted,"Attempted to read state from uninitialized service '".concat(this.id,"'. Make sure the service is started first.")),this._state},enumerable:!1,configurable:!0}),t.prototype.execute=function(t,e){var n,r
try{for(var o=(0,i.XA)(t.actions),a=o.next();!a.done;a=o.next()){var s=a.value
this.exec(s,t,e)}}catch(t){n={error:t}}finally{try{a&&!a.done&&(r=o.return)&&r.call(o)}finally{if(n)throw n.error}}},t.prototype.update=function(t,e){var n,r,o,a,c,h,f,l,d=this
if(t._sessionid=this.sessionId,this._state=t,this.machine.config.predictableActionArguments&&e!==s.initEvent||!this.options.execute)for(var p=void 0;p=this._outgoingQueue.shift();)p[0].send(p[1])
else this.execute(this.state)
if(this.children.forEach((function(t){d.state.children[t.id]=t})),this.devTools&&this.devTools.send(e.data,t),t.event)try{for(var v=(0,i.XA)(this.eventListeners),y=v.next();!y.done;y=v.next())(0,y.value)(t.event)}catch(t){n={error:t}}finally{try{y&&!y.done&&(r=v.return)&&r.call(v)}finally{if(n)throw n.error}}try{for(var g=(0,i.XA)(this.listeners),m=g.next();!m.done;m=g.next())(0,m.value)(t,t.event)}catch(t){o={error:t}}finally{try{m&&!m.done&&(a=g.return)&&a.call(g)}finally{if(o)throw o.error}}try{for(var b=(0,i.XA)(this.contextListeners),x=b.next();!x.done;x=b.next())(0,x.value)(this.state.context,this.state.history?this.state.history.context:void 0)}catch(t){c={error:t}}finally{try{x&&!x.done&&(h=b.return)&&h.call(b)}finally{if(c)throw c.error}}if(this.state.done){var w=t.configuration.find((function(t){return"final"===t.type&&t.parent===d.machine})),S=w&&w.doneData?(0,u.QX)(w.doneData,t.context,e):void 0
try{for(var _=(0,i.XA)(this.doneListeners),E=_.next();!E.done;E=_.next())(0,E.value)((0,s.doneInvoke)(this.id,S))}catch(t){f={error:t}}finally{try{E&&!E.done&&(l=_.return)&&l.call(_)}finally{if(f)throw f.error}}this._stop(),this._stopChildren()}},t.prototype.onTransition=function(t){return this.listeners.add(t),this.status===y.Running&&t(this.state,this.state.event),this},t.prototype.subscribe=function(t,e,n){var i=this,r=(0,u.zM)(t,e,n)
this.listeners.add(r.next),this.status!==y.NotStarted&&r.next(this.state)
var o=function(){i.doneListeners.delete(o),i.stopListeners.delete(o),r.complete()}
return this.status===y.Stopped?r.complete():(this.onDone(o),this.onStop(o)),{unsubscribe:function(){i.listeners.delete(r.next),i.doneListeners.delete(o),i.stopListeners.delete(o)}}},t.prototype.onEvent=function(t){return this.eventListeners.add(t),this},t.prototype.onSend=function(t){return this.sendListeners.add(t),this},t.prototype.onChange=function(t){return this.contextListeners.add(t),this},t.prototype.onStop=function(t){return this.stopListeners.add(t),this},t.prototype.onDone=function(t){return this.doneListeners.add(t),this},t.prototype.off=function(t){return this.listeners.delete(t),this.eventListeners.delete(t),this.sendListeners.delete(t),this.stopListeners.delete(t),this.doneListeners.delete(t),this.contextListeners.delete(t),this},t.prototype.start=function(t){var e,n=this
if(this.status===y.Running)return this
this.machine._init(),e=this.sessionId,d.set(e,this),this.initialized=!0,this.status=y.Running
var i=void 0===t?this.initialState:(0,g.J)(this,(function(){return(0,o.TL)(t)?n.machine.resolveState(t):n.machine.resolveState(o.ZM.from(t,n.machine.context))}))
return this.options.devTools&&this.attachDev(),this.scheduler.initialize((function(){n.update(i,s.initEvent)})),this},t.prototype._stopChildren=function(){this.children.forEach((function(t){(0,u.mf)(t.stop)&&t.stop()})),this.children.clear()},t.prototype._stop=function(){var t,e,n,r,o,a,s,c,u,h
try{for(var l=(0,i.XA)(this.listeners),d=l.next();!d.done;d=l.next()){var p=d.value
this.listeners.delete(p)}}catch(e){t={error:e}}finally{try{d&&!d.done&&(e=l.return)&&e.call(l)}finally{if(t)throw t.error}}try{for(var v=(0,i.XA)(this.stopListeners),g=v.next();!g.done;g=v.next())(p=g.value)(),this.stopListeners.delete(p)}catch(t){n={error:t}}finally{try{g&&!g.done&&(r=v.return)&&r.call(v)}finally{if(n)throw n.error}}try{for(var m=(0,i.XA)(this.contextListeners),b=m.next();!b.done;b=m.next())p=b.value,this.contextListeners.delete(p)}catch(t){o={error:t}}finally{try{b&&!b.done&&(a=m.return)&&a.call(m)}finally{if(o)throw o.error}}try{for(var x=(0,i.XA)(this.doneListeners),w=x.next();!w.done;w=x.next())p=w.value,this.doneListeners.delete(p)}catch(t){s={error:t}}finally{try{w&&!w.done&&(c=x.return)&&c.call(x)}finally{if(s)throw s.error}}if(!this.initialized)return this
this.initialized=!1,this.status=y.Stopped,this._initialState=void 0
try{for(var S=(0,i.XA)(Object.keys(this.delayedEventsMap)),_=S.next();!_.done;_=S.next()){var E=_.value
this.clock.clearTimeout(this.delayedEventsMap[E])}}catch(t){u={error:t}}finally{try{_&&!_.done&&(h=S.return)&&h.call(S)}finally{if(u)throw u.error}}this.scheduler.clear(),this.scheduler=new f({deferEvents:this.options.deferEvents})},t.prototype.stop=function(){var t=this,e=this.scheduler
return this._stop(),e.schedule((function(){var e,n=(0,u.g5)({type:"xstate.stop"}),c=(0,g.J)(t,(function(){var e=(0,u.xH)((0,i.ev)([],(0,i.CR)(t.state.configuration),!1).sort((function(t,e){return e.order-t.order})).map((function(e){return(0,s.toActionObjects)(e.onExit,t.machine.options.actions)}))),c=(0,i.CR)((0,s.resolveActions)(t.machine,t.state,t.state.context,n,[e],t.machine.config.predictableActionArguments?t._exec:void 0,t.machine.config.predictableActionArguments||t.machine.config.preserveActionOrder),2),h=c[0],f=c[1],l=new o.ZM({value:t.state.value,context:f,_event:n,_sessionid:t.sessionId,historyValue:void 0,history:t.state,actions:h.filter((function(t){return t.type!==a.raise&&(t.type!==a.send||!!t.to&&t.to!==r.K.Internal)})),activities:{},events:[],configuration:[],transitions:[],children:{},done:t.state.done,tags:t.state.tags,machine:t.machine})
return l.changed=!0,l}))
t.update(c,n),t._stopChildren(),e=t.sessionId,d.delete(e)})),this},t.prototype.batch=function(t){var e=this
if(this.status===y.NotStarted&&this.options.deferEvents)c.M||(0,u.ZK)(!1,"".concat(t.length,' event(s) were sent to uninitialized service "').concat(this.machine.id,'" and are deferred. Make sure .start() is called for this service.\nEvent: ').concat(JSON.stringify(event)))
else if(this.status!==y.Running)throw new Error("".concat(t.length,' event(s) were sent to uninitialized service "').concat(this.machine.id,'". Make sure .start() is called for this service, or set { deferEvents: true } in the service options.'))
if(t.length){var n=!!this.machine.config.predictableActionArguments&&this._exec
this.scheduler.schedule((function(){var r,a,s=e.state,c=!1,h=[],f=function(t){var r=(0,u.g5)(t)
e.forward(r),s=(0,g.J)(e,(function(){return e.machine.transition(s,r,void 0,n||void 0)})),h.push.apply(h,(0,i.ev)([],(0,i.CR)(e.machine.config.predictableActionArguments?s.actions:s.actions.map((function(t){return(0,o.j1)(t,s)}))),!1)),c=c||!!s.changed}
try{for(var l=(0,i.XA)(t),d=l.next();!d.done;d=l.next())f(d.value)}catch(t){r={error:t}}finally{try{d&&!d.done&&(a=l.return)&&a.call(l)}finally{if(r)throw r.error}}s.changed=c,s.actions=h,e.update(s,(0,u.g5)(t[t.length-1]))}))}},t.prototype.sender=function(t){return this.send.bind(this,t)},t.prototype._nextState=function(t,e){var n=this
void 0===e&&(e=!!this.machine.config.predictableActionArguments&&this._exec)
var i=(0,u.g5)(t)
if(0===i.name.indexOf(a.errorPlatform)&&!this.state.nextEvents.some((function(t){return 0===t.indexOf(a.errorPlatform)})))throw i.data.data
return(0,g.J)(this,(function(){return n.machine.transition(n.state,i,void 0,e||void 0)}))},t.prototype.nextState=function(t){return this._nextState(t,!1)},t.prototype.forward=function(t){var e,n
try{for(var r=(0,i.XA)(this.forwardTo),o=r.next();!o.done;o=r.next()){var a=o.value,s=this.children.get(a)
if(!s)throw new Error("Unable to forward event '".concat(t,"' from interpreter '").concat(this.id,"' to nonexistant child '").concat(a,"'."))
s.send(t)}}catch(t){e={error:t}}finally{try{o&&!o.done&&(n=r.return)&&n.call(r)}finally{if(e)throw e.error}}},t.prototype.defer=function(t){var e=this
this.delayedEventsMap[t.id]=this.clock.setTimeout((function(){t.to?e.sendTo(t._event,t.to,!0):e.send(t._event)}),t.delay)},t.prototype.cancel=function(t){this.clock.clearTimeout(this.delayedEventsMap[t]),delete this.delayedEventsMap[t]},t.prototype.exec=function(t,e,n){void 0===n&&(n=this.machine.options.actions),this._exec(t,e.context,e._event,n)},t.prototype.removeChild=function(t){var e
this.children.delete(t),this.forwardTo.delete(t),null===(e=this.state)||void 0===e||delete e.children[t]},t.prototype.stopChild=function(t){var e=this.children.get(t)
e&&(this.removeChild(t),(0,u.mf)(e.stop)&&e.stop())},t.prototype.spawn=function(t,e,n){if(this.status!==y.Running)return(0,l.Xg)(t,e)
if((0,u.y8)(t))return this.spawnPromise(Promise.resolve(t),e)
if((0,u.mf)(t))return this.spawnCallback(t,e)
if((0,l.f3)(t))return this.spawnActor(t,e)
if((0,u.bi)(t))return this.spawnObservable(t,e)
if((0,u.O4)(t))return this.spawnMachine(t,(0,i.pi)((0,i.pi)({},n),{id:e}))
if((0,u.HV)(t))return this.spawnBehavior(t,e)
throw new Error('Unable to spawn entity "'.concat(e,'" of type "').concat(typeof t,'".'))},t.prototype.spawnMachine=function(e,n){var r=this
void 0===n&&(n={})
var o=new t(e,(0,i.pi)((0,i.pi)({},this.options),{parent:this,id:n.id||e.id})),s=(0,i.pi)((0,i.pi)({},b),n)
s.sync&&o.onTransition((function(t){r.send(a.update,{state:t,id:o.id})}))
var c=o
return this.children.set(o.id,c),s.autoForward&&this.forwardTo.add(o.id),o.onDone((function(t){r.removeChild(o.id),r.send((0,u.g5)(t,{origin:o.id}))})).start(),c},t.prototype.spawnBehavior=function(t,e){var n=(0,m.YP)(t,{id:e,parent:this})
return this.children.set(e,n),n},t.prototype.spawnPromise=function(t,e){var n,i,r=this,o=!1
t.then((function(t){o||(i=t,r.removeChild(e),r.send((0,u.g5)((0,s.doneInvoke)(e,t),{origin:e})))}),(function(t){if(!o){r.removeChild(e)
var n=(0,s.error)(e,t)
try{r.send((0,u.g5)(n,{origin:e}))}catch(i){(0,u.v4)(t,i,e),r.devTools&&r.devTools.send(n,r.state),r.machine.strict&&r.stop()}}}))
var a=((n={id:e,send:function(){},subscribe:function(e,n,i){var r=(0,u.zM)(e,n,i),o=!1
return t.then((function(t){o||(r.next(t),o||r.complete())}),(function(t){o||r.error(t)})),{unsubscribe:function(){return o=!0}}},stop:function(){o=!0},toJSON:function(){return{id:e}},getSnapshot:function(){return i}})[u.L$]=function(){return this},n)
return this.children.set(e,a),a},t.prototype.spawnCallback=function(t,e){var n,i,r,o=this,a=!1,c=new Set,h=new Set
try{r=t((function(t){i=t,h.forEach((function(e){return e(t)})),a||o.send((0,u.g5)(t,{origin:e}))}),(function(t){c.add(t)}))}catch(t){this.send((0,s.error)(e,t))}if((0,u.y8)(r))return this.spawnPromise(r,e)
var f=((n={id:e,send:function(t){return c.forEach((function(e){return e(t)}))},subscribe:function(t){var e=(0,u.zM)(t)
return h.add(e.next),{unsubscribe:function(){h.delete(e.next)}}},stop:function(){a=!0,(0,u.mf)(r)&&r()},toJSON:function(){return{id:e}},getSnapshot:function(){return i}})[u.L$]=function(){return this},n)
return this.children.set(e,f),f},t.prototype.spawnObservable=function(t,e){var n,i,r=this,o=t.subscribe((function(t){i=t,r.send((0,u.g5)(t,{origin:e}))}),(function(t){r.removeChild(e),r.send((0,u.g5)((0,s.error)(e,t),{origin:e}))}),(function(){r.removeChild(e),r.send((0,u.g5)((0,s.doneInvoke)(e),{origin:e}))})),a=((n={id:e,send:function(){},subscribe:function(e,n,i){return t.subscribe(e,n,i)},stop:function(){return o.unsubscribe()},getSnapshot:function(){return i},toJSON:function(){return{id:e}}})[u.L$]=function(){return this},n)
return this.children.set(e,a),a},t.prototype.spawnActor=function(t,e){return this.children.set(e,t),t},t.prototype.spawnActivity=function(t){var e=this.machine.options&&this.machine.options.activities?this.machine.options.activities[t.type]:void 0
if(e){var n=e(this.state.context,t)
this.spawnEffect(t.id,n)}else c.M||(0,u.ZK)(!1,"No implementation found for activity '".concat(t.type,"'"))},t.prototype.spawnEffect=function(t,e){var n
this.children.set(t,((n={id:t,send:function(){},subscribe:function(){return{unsubscribe:function(){}}},stop:e||void 0,getSnapshot:function(){},toJSON:function(){return{id:t}}})[u.L$]=function(){return this},n))},t.prototype.attachDev=function(){var t=v()
if(this.options.devTools&&t){if(t.__REDUX_DEVTOOLS_EXTENSION__){var e="object"==typeof this.options.devTools?this.options.devTools:void 0
this.devTools=t.__REDUX_DEVTOOLS_EXTENSION__.connect((0,i.pi)((0,i.pi)({name:this.id,autoPause:!0,stateSanitizer:function(t){return{value:t.value,context:t.context,actions:t.actions}}},e),{features:(0,i.pi)({jump:!1,skip:!1},e?e.features:void 0)}),this.machine),this.devTools.init(this.state)}!function(t){if(v()){var e=function(){var t=v()
if(t&&"__xstate__"in t)return t.__xstate__}()
e&&e.register(t)}}(this)}},t.prototype.toJSON=function(){return{id:this.id}},t.prototype[u.L$]=function(){return this},t.prototype.getSnapshot=function(){return this.status===y.NotStarted?this.initialState:this._state},t.defaultOptions={execute:!0,deferEvents:!0,clock:{setTimeout:function(t,e){return setTimeout(t,e)},clearTimeout:function(t){return clearTimeout(t)}},logger:console.log.bind(console),devTools:!1},t.interpret=S,t}()
function w(t,e){var n=function(t){return(0,u.HD)(t)?(0,i.pi)((0,i.pi)({},b),{name:t}):(0,i.pi)((0,i.pi)((0,i.pi)({},b),{name:(0,u.EL)()}),t)}(e)
return(0,g.F)((function(e){if(!c.M){var i=(0,u.O4)(t)||(0,u.mf)(t);(0,u.ZK)(!!e||i,'Attempted to spawn an Actor (ID: "'.concat((0,u.O4)(t)?t.id:"undefined",'") outside of a service. This will have no effect.'))}return e?e.spawn(t,n.name,n):(0,l.Xg)(t,n.name)}))}function S(t,e){return new x(t,e)}},500:(t,e,n)=>{n.d(e,{F:()=>o,J:()=>r})
var i=[],r=function(t,e){i.push(t)
var n=e(t)
return i.pop(),n},o=function(t){return t(i[i.length-1])}},215:(t,e,n)=>{n.d(e,{G:()=>s,Ij:()=>v,N9:()=>o,NA:()=>l,Oe:()=>g,P_:()=>u,ac:()=>c,e$:()=>d,nI:()=>a,nJ:()=>p,xZ:()=>y})
var i=n(432),r=n(861),o=function(t){return"atomic"===t.type||"final"===t.type}
function a(t){return Object.keys(t.states).map((function(e){return t.states[e]}))}function s(t){return a(t).filter((function(t){return"history"!==t.type}))}function c(t){var e=[t]
return o(t)?e:e.concat((0,r.xH)(s(t).map(c)))}function u(t,e){var n,r,o,a,c,u,h,l,d=f(new Set(t)),p=new Set(e)
try{for(var v=(0,i.XA)(p),y=v.next();!y.done;y=v.next())for(var g=(O=y.value).parent;g&&!p.has(g);)p.add(g),g=g.parent}catch(t){n={error:t}}finally{try{y&&!y.done&&(r=v.return)&&r.call(v)}finally{if(n)throw n.error}}var m=f(p)
try{for(var b=(0,i.XA)(p),x=b.next();!x.done;x=b.next())if("compound"!==(O=x.value).type||m.get(O)&&m.get(O).length){if("parallel"===O.type)try{for(var w=(c=void 0,(0,i.XA)(s(O))),S=w.next();!S.done;S=w.next()){var _=S.value
p.has(_)||(p.add(_),d.get(_)?d.get(_).forEach((function(t){return p.add(t)})):_.initialStateNodes.forEach((function(t){return p.add(t)})))}}catch(t){c={error:t}}finally{try{S&&!S.done&&(u=w.return)&&u.call(w)}finally{if(c)throw c.error}}}else d.get(O)?d.get(O).forEach((function(t){return p.add(t)})):O.initialStateNodes.forEach((function(t){return p.add(t)}))}catch(t){o={error:t}}finally{try{x&&!x.done&&(a=b.return)&&a.call(b)}finally{if(o)throw o.error}}try{for(var E=(0,i.XA)(p),A=E.next();!A.done;A=E.next()){var O
for(g=(O=A.value).parent;g&&!p.has(g);)p.add(g),g=g.parent}}catch(t){h={error:t}}finally{try{A&&!A.done&&(l=E.return)&&l.call(E)}finally{if(h)throw h.error}}return p}function h(t,e){var n=e.get(t)
if(!n)return{}
if("compound"===t.type){var i=n[0]
if(!i)return{}
if(o(i))return i.key}var r={}
return n.forEach((function(t){r[t.key]=h(t,e)})),r}function f(t){var e,n,r=new Map
try{for(var o=(0,i.XA)(t),a=o.next();!a.done;a=o.next()){var s=a.value
r.has(s)||r.set(s,[]),s.parent&&(r.has(s.parent)||r.set(s.parent,[]),r.get(s.parent).push(s))}}catch(t){e={error:t}}finally{try{a&&!a.done&&(n=o.return)&&n.call(o)}finally{if(e)throw e.error}}return r}function l(t,e){return h(t,f(u([t],e)))}function d(t,e){return Array.isArray(t)?t.some((function(t){return t===e})):t instanceof Set&&t.has(e)}function p(t){return(0,i.ev)([],(0,i.CR)(new Set((0,r.xH)((0,i.ev)([],(0,i.CR)(t.map((function(t){return t.ownEvents}))),!1)))),!1)}function v(t,e){return"compound"===e.type?s(e).some((function(e){return"final"===e.type&&d(t,e)})):"parallel"===e.type&&s(e).every((function(e){return v(t,e)}))}function y(t){return void 0===t&&(t=[]),t.reduce((function(t,e){return void 0!==e.meta&&(t[e.id]=e.meta),t}),{})}function g(t){return new Set((0,r.xH)(t.map((function(t){return t.tags}))))}},228:(t,e,n)=>{var i,r
n.d(e,{K:()=>r,M:()=>i}),function(t){t.Start="xstate.start",t.Stop="xstate.stop",t.Raise="xstate.raise",t.Send="xstate.send",t.Cancel="xstate.cancel",t.NullEvent="",t.Assign="xstate.assign",t.After="xstate.after",t.DoneState="done.state",t.DoneInvoke="done.invoke",t.Log="xstate.log",t.Init="xstate.init",t.Invoke="xstate.invoke",t.ErrorExecution="error.execution",t.ErrorCommunication="error.communication",t.ErrorPlatform="error.platform",t.ErrorCustom="xstate.error",t.Update="xstate.update",t.Pure="xstate.pure",t.Choose="xstate.choose"}(i||(i={})),function(t){t.Parent="#_parent",t.Internal="#_internal"}(r||(r={}))},861:(t,e,n)=>{n.d(e,{Bc:()=>H,EL:()=>I,ET:()=>p,HD:()=>N,HV:()=>_,JQ:()=>w,L$:()=>R,O4:()=>D,Q8:()=>l,Q9:()=>u,QX:()=>x,Qi:()=>C,SA:()=>y,W:()=>s,WM:()=>h,ZK:()=>M,_v:()=>X,bi:()=>P,bx:()=>$,dt:()=>k,g5:()=>L,gk:()=>v,ib:()=>d,j:()=>z,jh:()=>V,kJ:()=>j,mf:()=>T,on:()=>f,qo:()=>b,rg:()=>Z,uK:()=>E,v4:()=>K,vx:()=>J,x6:()=>c,xH:()=>g,y8:()=>S,yv:()=>O,zM:()=>Q})
var i,r=n(432),o=n(34),a=n(197)
function s(t,e,n){void 0===n&&(n=o.iS)
var i=h(t,n),r=h(e,n)
return N(r)?!!N(i)&&r===i:N(i)?i in r:Object.keys(i).every((function(t){return t in r&&s(i[t],r[t])}))}function c(t){try{return N(t)||"number"==typeof t?"".concat(t):t.type}catch(t){throw new Error("Events must be strings or objects with a string event.type property.")}}function u(t,e){try{return j(t)?t:t.toString().split(e)}catch(e){throw new Error("'".concat(t,"' is not a valid state path."))}}function h(t,e){return"object"==typeof(n=t)&&"value"in n&&"context"in n&&"event"in n&&"_event"in n?t.value:j(t)?f(t):"string"!=typeof t?t:f(u(t,e))
var n}function f(t){if(1===t.length)return t[0]
for(var e={},n=e,i=0;i<t.length-1;i++)i===t.length-2?n[t[i]]=t[i+1]:(n[t[i]]={},n=n[t[i]])
return e}function l(t,e){for(var n={},i=Object.keys(t),r=0;r<i.length;r++){var o=i[r]
n[o]=e(t[o],o,t,r)}return n}function d(t,e,n){var i,o,a={}
try{for(var s=(0,r.XA)(Object.keys(t)),c=s.next();!c.done;c=s.next()){var u=c.value,h=t[u]
n(h)&&(a[u]=e(h,u,t))}}catch(t){i={error:t}}finally{try{c&&!c.done&&(o=s.return)&&o.call(s)}finally{if(i)throw i.error}}return a}var p=function(t){return function(e){var n,i,o=e
try{for(var a=(0,r.XA)(t),s=a.next();!s.done;s=a.next())o=o[s.value]}catch(t){n={error:t}}finally{try{s&&!s.done&&(i=a.return)&&i.call(a)}finally{if(n)throw n.error}}return o}}
function v(t,e){return function(n){var i,o,a=n
try{for(var s=(0,r.XA)(t),c=s.next();!c.done;c=s.next()){var u=c.value
a=a[e][u]}}catch(t){i={error:t}}finally{try{c&&!c.done&&(o=s.return)&&o.call(s)}finally{if(i)throw i.error}}return a}}function y(t){return t?N(t)?[[t]]:g(Object.keys(t).map((function(e){var n=t[e]
return"string"==typeof n||n&&Object.keys(n).length?y(t[e]).map((function(t){return[e].concat(t)})):[[e]]}))):[[]]}function g(t){var e
return(e=[]).concat.apply(e,(0,r.ev)([],(0,r.CR)(t),!1))}function m(t){return j(t)?t:[t]}function b(t){return void 0===t?[]:m(t)}function x(t,e,n){var i,o
if(T(t))return t(e,n.data)
var a={}
try{for(var s=(0,r.XA)(Object.keys(t)),c=s.next();!c.done;c=s.next()){var u=c.value,h=t[u]
T(h)?a[u]=h(e,n.data):a[u]=h}}catch(t){i={error:t}}finally{try{c&&!c.done&&(o=s.return)&&o.call(s)}finally{if(i)throw i.error}}return a}function w(t){return/^(done|error)\./.test(t)}function S(t){return t instanceof Promise||!(null===t||!T(t)&&"object"!=typeof t||!T(t.then))}function _(t){return null!==t&&"object"==typeof t&&"transition"in t&&"function"==typeof t.transition}function E(t,e){var n,i,o=(0,r.CR)([[],[]],2),a=o[0],s=o[1]
try{for(var c=(0,r.XA)(t),u=c.next();!u.done;u=c.next()){var h=u.value
e(h)?a.push(h):s.push(h)}}catch(t){n={error:t}}finally{try{u&&!u.done&&(i=c.return)&&i.call(c)}finally{if(n)throw n.error}}return[a,s]}function A(t,e){return l(t.states,(function(t,n){if(t){var i=(N(e)?void 0:e[n])||(t?t.current:void 0)
if(i)return{current:i,states:A(t,i)}}}))}function O(t,e){return{current:e,states:A(t,e)}}function k(t,e,n,i){a.M||M(!!t,"Attempting to update undefined context")
var o=t?n.reduce((function(t,n){var o,a,s=n.assignment,c={state:i,action:n,_event:e},u={}
if(T(s))u=s(t,e.data,c)
else try{for(var h=(0,r.XA)(Object.keys(s)),f=h.next();!f.done;f=h.next()){var l=f.value,d=s[l]
u[l]=T(d)?d(t,e.data,c):d}}catch(t){o={error:t}}finally{try{f&&!f.done&&(a=h.return)&&a.call(h)}finally{if(o)throw o.error}}return Object.assign({},t,u)}),t):t
return o}var M=function(){}
function j(t){return Array.isArray(t)}function T(t){return"function"==typeof t}function N(t){return"string"==typeof t}function C(t,e){if(t)return N(t)?{type:o.TV,name:t,predicate:e?e[t]:void 0}:T(t)?{type:o.TV,name:t.name,predicate:t}:t}function P(t){try{return"subscribe"in t&&T(t.subscribe)}catch(t){return!1}}a.M||(M=function(t,e){var n=t instanceof Error?t:void 0
if((n||!t)&&void 0!==console){var i=["Warning: ".concat(e)]
n&&i.push(n),console.warn.apply(console,i)}})
var R="function"==typeof Symbol&&Symbol.observable||"@@observable"
function D(t){return!!t&&"__xstatenode"in t}function H(t){return!!t&&"function"==typeof t.send}(i={})[R]=function(){return this},i[Symbol.observable]=function(){return this}
var I=function(){var t=0
return function(){return(++t).toString(16)}}()
function X(t,e){return N(t)||"number"==typeof t?(0,r.pi)({type:t},e):t}function L(t,e){if(!N(t)&&"$$type"in t&&"scxml"===t.$$type)return t
var n=X(t)
return(0,r.pi)({name:n.type,data:n,$$type:"scxml",type:"external"},e)}function V(t,e){return m(e).map((function(e){return void 0===e||"string"==typeof e||D(e)?{target:e,event:t}:(0,r.pi)((0,r.pi)({},e),{event:t})}))}function Z(t){if(void 0!==t&&t!==o.rt)return b(t)}function K(t,e,n){if(!a.M){var i=t.stack?" Stacktrace was '".concat(t.stack,"'"):""
if(t===e)console.error("Missing onError handler for invocation '".concat(n,"', error was '").concat(t,"'.").concat(i))
else{var r=e.stack?" Stacktrace was '".concat(e.stack,"'"):""
console.error("Missing onError handler and/or unhandled exception/promise rejection for invocation '".concat(n,"'. ")+"Original error: '".concat(t,"'. ").concat(i," Current error is '").concat(e,"'.").concat(r))}}}function J(t,e,n,i,r){var a=t.options.guards,s={state:r,cond:e,_event:i}
if(e.type===o.TV)return((null==a?void 0:a[e.name])||e.predicate)(n,i.data,s)
var c=null==a?void 0:a[e.type]
if(!c)throw new Error("Guard '".concat(e.type,"' is not implemented on machine '").concat(t.id,"'."))
return c(n,i.data,s)}function z(t){return"string"==typeof t?{type:t}:t}function Q(t,e,n){var i=function(){},r="object"==typeof t,o=r?t:null
return{next:((r?t.next:t)||i).bind(o),error:((r?t.error:e)||i).bind(o),complete:((r?t.complete:n)||i).bind(o)}}function $(t,e){return"".concat(t,":invocation[").concat(e,"]")}}}])
