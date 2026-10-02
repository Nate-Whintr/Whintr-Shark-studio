(function(){
var t=document.querySelector('.menu-toggle'),l=document.getElementById('nav-list');
if(t&&l){t.addEventListener('click',function(){var o=l.classList.toggle('open');t.setAttribute('aria-expanded',o);});}
var f=document.getElementById('contact-form');
if(!f)return;
var rules={name:function(v){return v.trim().length>=2?'':'Enter your name (at least 2 characters).';},
email:function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?'':'Enter a valid email address, like name@example.com.';},
message:function(v){return v.trim().length>=10?'':'Enter a message of at least 10 characters.';}};
function check(el){var m=rules[el.name](el.value);
document.getElementById(el.name+'-error').textContent=m;
el.setAttribute('aria-invalid',m?'true':'false');return !m;}
Object.keys(rules).forEach(function(n){var el=f.elements[n];
el.addEventListener('blur',function(){check(el);});
el.addEventListener('input',function(){if(el.getAttribute('aria-invalid')==='true')check(el);});});
f.addEventListener('submit',function(e){e.preventDefault();
var ok=true,first=null,s=document.getElementById('form-success');
Object.keys(rules).forEach(function(n){var el=f.elements[n];if(!check(el)){ok=false;if(!first)first=el;}});
if(!ok){s.hidden=true;first.focus();return;}
// TODO: send the data to a real service (e.g. Formspree) instead of only confirming it here.
s.textContent='Thanks, '+f.elements.name.value.trim()+'! Your message was received. Expect a reply at '+f.elements.email.value.trim()+'.';
s.hidden=false;f.reset();});
})();
