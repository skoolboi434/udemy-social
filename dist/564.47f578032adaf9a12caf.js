"use strict";(self.webpackChunkcomplex_react_app=self.webpackChunkcomplex_react_app||[]).push([[564],{882:(e,t,a)=>{a.r(t),a.d(t,{default:()=>m});var l=a(294),o=a(250),r=a(387),s=a(257),n=a(983),c=a(564);const m=e=>{const[t,a]=(0,l.useState)(),[m,p]=(0,l.useState)(),u=(0,o.s0)(),d=(0,l.useContext)(n.Z),b=(0,l.useContext)(c.Z);return l.createElement(r.Z,{title:"Create New Post"},l.createElement("form",{onSubmit:async e=>{e.preventDefault();try{const e=await s.Z.post("/create-post",{title:t,body:m,token:b.user.token});d({type:"flashMessage",value:"Congrats, you created a new post."}),u(`/post/${e.data}`)}catch(e){console.log(`There was a problem: ${e}`)}}},l.createElement("div",{className:"form-group"},l.createElement("label",{htmlFor:"post-title",className:"text-muted mb-1"},l.createElement("small",null,"Title")),l.createElement("input",{onChange:e=>a(e.target.value),autoFocus:!0,name:"title",id:"post-title",className:"form-control form-control-lg form-control-title",type:"text",placeholder:"",autoComplete:"off"})),l.createElement("div",{className:"form-group"},l.createElement("label",{htmlFor:"post-body",className:"text-muted mb-1 d-block"},l.createElement("small",null,"Body Content")),l.createElement("textarea",{onChange:e=>p(e.target.value),name:"body",id:"post-body",className:"body-content tall-textarea form-control",type:"text"})),l.createElement("button",{className:"btn btn-primary"},"Save New Post")))}}}]);