(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[434],{8434:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return Q}});var r=t(2156),a=t(5144),s=t.n(a),o=t(959),i=t(1761),c=t(6943),l=t(4981),u=t(5276),m=t(4247),d=t.n(m),_=t(2660),g=t(8787),p=t(2754),f=t(8552),v=t(185),w=t(2882),S=t(807),E=function(e,n){return o.createElement(S.Z,(0,v.Z)((0,v.Z)({},e),{},{ref:n,icon:w.Z}))};E.displayName="LoadingOutlined";var b=o.forwardRef(E),Z=t(9565),y=function(e,n){return o.createElement(S.Z,(0,v.Z)((0,v.Z)({},e),{},{ref:n,icon:Z.Z}))};y.displayName="PlusOutlined";var P=o.forwardRef(y),h=t(2649),I=t(2699),N=t(926),k=t(8297),O=t.n(k),C=t(6701),R=t(5184),U=t(8184),x=t(6563),j=t(3312),F=t(4434),q=t(7373),T=t(9927),W=g.Z.useForm,D=function(e){var n=(0,F.Z)().setMessageOptions,t="image/jpeg"===e.type||"image/png"===e.type;t||n({message:"You can only upload JPG/PNG file!",type:"error"});var r=e.size/1024/1024<2;return r||n({message:"Image must smaller than 2MB!",type:"error"}),t&&r},M=function(e){var n,t=e.type,a=e.changeStatus,u=(0,o.useState)(""),m=u[0],d=u[1],v=(0,o.useState)("red"),w=v[0],S=v[1],E=(0,o.useState)(!1),Z=E[0],y=E[1],k=(0,o.useState)(!1),F=k[0],M=k[1],H=(0,o.useState)(""),Y=H[0],G=H[1],B=(0,i.I0)(),L=W(),V=(0,_.Z)(L,1)[0],Q=(0,o.useCallback)((n=(0,r.Z)(s().mark(function e(n){var r,o,i,c,l,u,m,_,g,p,f,v,w,E;return s().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r=n.name,o=n.email,i=n.password,c=n.repeatPassword,"SignIn"!=t){e.next=30;break}return M(!0),e.next=5,(0,C.Z)("SignIn",{email:o,password:i});case 5:if(u=e.sent,m={},null!==(l=u.SignIn)&&void 0!==l&&l.token&&(m=(0,N.Z)(null===(_=u.SignIn)||void 0===_?void 0:_.token),localStorage.setItem("token",null===(g=u.SignIn)||void 0===g?void 0:g.token)),m.email){e.next=23;break}if(S("red"),!(null!==(p=u.SignIn)&&void 0!==p&&p.message)){e.next=14;break}return d((0,x.HY)(null===(f=u.SignIn)||void 0===f?void 0:f.message,20)),M(!1),e.abrupt("return");case 14:if(!u.errors){e.next=19;break}return d((0,x.HY)(u.erros[0],20)),M(!1),e.abrupt("return");case 19:return d("Not Found"),M(!1),e.abrupt("return");case 23:(v=(0,h.io)(q.e8)).emit("signedIn",{id:m.id},function(e){Object.hasOwn(e,"notSeenCount")&&B((0,T.py)(Number(null==e?void 0:e.notSeenCount)))}),B((0,j.u)(v)),M(!1),B((0,R.W)(m)),e.next=51;break;case 30:if("SignUp"!=t){e.next=50;break}if(!(c!==i)){e.next=34;break}return d("Password must be repeated"),e.abrupt("return");case 34:return M(!0),e.next=37,(0,C.Z)("SignUp",{email:o,password:i,name:r,image:Y});case 37:if(null!==(w=(E=e.sent).SignUp)&&void 0!==w&&w.email){e.next=44;break}return E.message&&d((0,x.HY)(E.message,20)),E.errors&&d((0,x.HY)(E.erors[0],20)),S("red"),M(!1),e.abrupt("return");case 44:M(!1),d("Signed Up!"),S("green"),a(),e.next=51;break;case 50:return e.abrupt("return");case 51:case"end":return e.stop()}},e)})),function(e){return n.apply(this,arguments)}),[a,h.io,B,R.W,S,d,C.Z,M]);(0,o.useEffect)(function(){V.resetFields()},[t]);var z=o.createElement("div",null,Z?o.createElement(b,null):o.createElement(P,null),o.createElement("div",{style:{marginTop:8}},"Upload"));return o.createElement("div",{className:O().sign_main,style:{height:"auto"}},F&&o.createElement(U.Z,null),o.createElement(g.Z,{onFinish:function(e){return Q(e)},onChange:function(){m&&d("")},form:V,className:O().sign_form},"SignUp"==t?o.createElement(o.Fragment,null,o.createElement(g.Z.Item,{className:O().form_item,name:"image"},o.createElement(p.Z,{name:"avatar",listType:"picture-card",showUploadList:!1,beforeUpload:D,onChange:function(e){var n=(0,I.last)(e.fileList);(0,x.y3)(n.originFileObj,function(e){y(!1),G(e)})}},Y?o.createElement("img",{src:Y,alt:"avatar",style:{width:"100%"}}):z)),o.createElement(g.Z.Item,{className:O().form_item,rules:[{required:!0,min:3}],name:"name"},o.createElement(f.Z,{placeholder:"Name",className:O().sign_input}))):null,o.createElement(g.Z.Item,{rules:[{required:!0,type:"email"}],className:O().form_item,name:"email"},o.createElement(f.Z,{placeholder:"Email",className:O().sign_input})),o.createElement(g.Z.Item,{className:O().form_item,rules:[{required:!0,min:8}],name:"password"},o.createElement(f.Z,{placeholder:"Password",type:"password",className:O().sign_input})),"SignUp"==t?o.createElement(g.Z.Item,{className:O().form_item,rules:[{required:!0,min:8}],name:"repeatPassword"},o.createElement(f.Z,{placeholder:"Repeat Password",type:"password",className:O().sign_input})):null,o.createElement(c.Z,{className:O().sign_message,style:{color:w}},m),o.createElement(g.Z.Item,{className:O().form_item},o.createElement(l.ZP,{type:"primary",htmlType:"submit",className:O().sign_button},"SignIn"==t?"Sign In":"Sign Up"))))},H=t(163),Y=t(9917),G=t(8480),B=t.n(G);function L(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter(function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable})),t.push.apply(t,r)}return t}var V=function(e){var n,t=e.changeStatus,a=(0,o.useState)(!1),i=a[0],u=a[1],m=(0,o.useState)(""),d=m[0],_=m[1],p=(0,o.useState)(""),v=p[0],w=p[1],S=(0,o.useState)("getCode"),E=S[0],b=S[1],Z=(0,o.useState)({}),y=Z[0],P=Z[1],h=(0,o.useState)(""),I=h[0],N=h[1],k=(0,o.useState)({min:q.nq/1e3,sec:0}),O=k[0],R=k[1],U=(0,o.useRef)(),j=(0,F.Z)().setMessageOptions,T=(n=(0,r.Z)(s().mark(function e(){var n,r,a,o,i;return s().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(d!==I){e.next=9;break}return u(!0),e.next=4,(0,C.Z)("ConfirmRecoveredPassword",{id:y.id,newPassword:d});case 4:null!=(a=e.sent)&&null!==(n=a.ConfirmRecoveredPassword)&&void 0!==n&&n.successMessage?j({type:"success",message:null==a?void 0:null===(o=a.ConfirmRecoveredPassword)||void 0===o?void 0:o.successMessage}):null!=a&&null!==(r=a.ConfirmRecoveredPassword)&&void 0!==r&&r.message?j({type:"error",message:null==a?void 0:null===(i=a.ConfirmRecoveredPassword)||void 0===i?void 0:i.message}):j({type:"error",message:"Not Changed"}),setTimeout(function(){t("SignIn")},350),e.next=10;break;case 9:w("Please repeat the password");case 10:case"end":return e.stop()}},e)})),function(){return n.apply(this,arguments)});return(0,o.useEffect)(function(){w(""),u(!1)},[E]),o.createElement("div",{className:B().recover_password_main},o.createElement(c.Z,{className:B().recover_password_main_title,style:{color:"failed"===E?"red":""}},"getCode"===E?" Enter your email to get the verification code":"confirm"===E?"Enter the verification code sent to your email":""),o.createElement(g.Z,{className:B().form_item,onFinish:"getCode"===E?function(){(0,r.Z)(s().mark(function e(){var n,r,a,o;return s().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return u(!0),e.next=3,(0,C.Z)("RecoverPassword",{email:d});case 3:null!=(a=e.sent)&&null!==(n=a.RecoverPassword)&&void 0!==n&&n.code?(b("confirm"),P(null==a?void 0:a.RecoverPassword),U.current=setInterval(function(){if(0===O.sec&&0===O.min){clearInterval(U.current);return}R(function(e){return 0===e.sec&&0===e.min?(t("SignIn"),j({type:"error",messge:"Recovery failed"}),e):(e.sec<=0?(e.sec=59,e.min=e.min-1):e.sec=e.sec-1,function(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?L(Object(t),!0).forEach(function(n){(0,Y.Z)(e,n,t[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):L(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})}return e}({},e))})},1e3),u(!1)):null!=a&&null!==(r=a.RecoverPassword)&&void 0!==r&&r.message?(w(null==a?void 0:null===(o=a.RecoverPassword)||void 0===o?void 0:o.message),u(!1)):(w("User Not Found"),u(!1));case 5:case"end":return e.stop()}},e)}))()}:"confirm"===E?function(){Number(d)===y.code?b("setPassword"):w("Wrong recovery code")}:"setPassword"===E?T:function(){}},o.createElement(g.Z.Item,{className:B().form_item,name:"getCode"===E?"email":"confirm"===E?"code":"setPassword"===E?"password":"",rules:"setPassword"===E?[{required:!0,min:8}]:[{required:!0,min:4}]},o.createElement(f.Z,{value:d,disabled:i,onChange:function(e){var n;return _(null==e?void 0:null===(n=e.target)||void 0===n?void 0:n.value)},placeholder:"getCode"===E?"Email":"confirm"===E?"Code":"setPassword"===E?"New Password":"",className:B().sign_input})),"setPassword"===E&&o.createElement(g.Z.Item,{className:B().form_item,name:"repeatPassword",rules:[{required:!0,min:4}]},o.createElement(f.Z,{disabled:i,value:I,onChange:function(e){var n;return N(null==e?void 0:null===(n=e.target)||void 0===n?void 0:n.value)},placeholder:"Repeat Password",className:B().sign_input})),"confirm"===E&&o.createElement(c.Z,{className:B().timeout_string},(0,x.u6)(O)),o.createElement(c.Z,{className:B().message},v),o.createElement(g.Z.Item,null,o.createElement(l.ZP,{disabled:i,type:"primary",htmlType:"submit",className:B().recover_button},"getCode"===E?"Get Code":"confirm"===E?"Confirm":"setPassword"===E?"Change Password":""))))},Q=function(e){var n=e.userContRef,t=(0,o.useState)(""),a=t[0],m=t[1],_=(0,o.useState)("SignIn"),g=_[0],p=_[1],f=(0,o.useState)({}),v=f[0],w=f[1],S=(0,i.I0)(),E=(0,o.useRef)(),b=(0,i.v9)(function(e){return e.user.user}),Z=function(){p(function(e){return"SignIn"==e?"SignUp":"SignIn"})},y=(0,i.v9)(function(e){return e.socket.socket}),P=(0,o.useCallback)((0,r.Z)(s().mark(function e(){var n;return s().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,C.Z)("SignOut");case 2:n=e.sent,y.disconnect(),n.SignOut?"Signed Out"==n.SignOut&&(localStorage.removeItem("token"),S((0,R.W)({name:"",email:"",image:"",friendRequests:[],friends:[],active:!1}))):m("Error Occured");case 5:case"end":return e.stop()}},e)})),[m,y,S,R.W]);return(0,u.t$)(E,function(e){var t;e.target==n.current||null!==(t=n.current)&&void 0!==t&&t.contains(e.target)||S((0,H.pT)(!1))}),(0,o.useEffect)(function(){w(b)},[b]),(0,o.useEffect)(function(){m("")},[g]),o.createElement("div",{"data-testid":"ownerWindow",className:d().owner_main,ref:E},v.name?o.createElement(o.Fragment,null,o.createElement("div",{className:d().data_cont},o.createElement(c.Z,{className:d().owner_email},v.email),o.createElement(l.ZP,{className:d().signout_button,type:"primary",onClick:function(){return P()}},"Sign Out")),o.createElement("div",null,o.createElement(c.Z,null,a))):o.createElement(o.Fragment,null,"SignUp"==g?o.createElement(M,{changeStatus:Z,type:"SignUp"}):"SignIn"==g?o.createElement(M,{changeStatus:Z,type:"SignIn"}):"Recover"==g?o.createElement(V,{changeStatus:Z}):null,o.createElement("div",{className:d().owner_link_cont},o.createElement("a",{onClick:function(){return p(function(e){return"SignIn"==e?"SignUp":"SignIn"})},className:d().owner_link_cont_link},"SignUp"==g?"Sign In":"SignIn"==g?"Sign Up":"Recover"==g?"Sign In":""),"SignIn"==g&&o.createElement("a",{onClick:function(){return p("Recover")},className:d().owner_link_cont_link},"Forgot Password"))))}},4247:function(e){e.exports={owner_main:"Owner_owner_main__TExW5",owner_link_cont:"Owner_owner_link_cont__EjBVh",owner_link_cont_link:"Owner_owner_link_cont_link__4qthb",data_cont:"Owner_data_cont__uXsRG",owner_email:"Owner_owner_email__cyHbV",signout_button:"Owner_signout_button__uG3gq"}},8480:function(e){e.exports={recover_password_main:"RecoverPassword_recover_password_main__MENCW",recover_password_main_title:"RecoverPassword_recover_password_main_title__rEDRQ",form_item:"RecoverPassword_form_item__uhhPL",timeout_string:"RecoverPassword_timeout_string__y9_OB",message:"RecoverPassword_message___t5_B",recover_button:"RecoverPassword_recover_button__DHSvS"}},8297:function(e){e.exports={sign_main:"SignInUp_sign_main__OU9Ve",sign_form:"SignInUp_sign_form__vSQR2",sign_message:"SignInUp_sign_message__4aNlY",form_item:"SignInUp_form_item__uVZ9T",sign_input:"SignInUp_sign_input__MISNC",sign_button:"SignInUp_sign_button__4sD20",form_item_button:"SignInUp_form_item_button__FNC9P"}}}]);