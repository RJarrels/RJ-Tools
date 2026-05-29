<h3>Quick tools</h3>: is a toolbox allowing workers at iFIT to simplify repetative processes in their chrome browser windows to reduce repetative tasks. Quick tools also has tools that help in testing or simplifying processes. 
Current tools in Quick Tools inlcude:
<ul>
  <li>Bypass Vercel: This puts in the password and clicks unlock for you so you don't have to type it in every time. </li>
  <li>New Incog Window: This button closes the current incog window and opens a new one, is intended to make closing incogs and open new ones faster.</li>
  <li>Component Scanner, this allows the user to scan the current tabs page for components. Which will then be highlighted and the name of the component will show to the user for quick reference of component locations in CS.</li>
</ul>
<p> To initialize the folder once the repo is copied or downloaded run these commands.</p>
<p>
In your terminal.....
# 1. Install all required dependencies (including Vite)
<li><b>npm install</b></li>

#2. Build the extension and generate the 'dist' folder
<li><b>npm run build</b></li>

</p>
<p>To add the extension to your google chrome:
  <ul>
    <li>Open Google Chrome and go to chrome://extensions/.</li>
    <li>Turn on Developer mode (top-right toggle).</li>
    <li>Click Load unpacked (top-left button).</li>
    <li>Select the <b>dist</b> folder inside your repository.</li>
  </ul>
</p>
<p> Lastly, in the root directory, create a file named .env and in this file add this variable ( <b>VITE_VERCEL_BYPASS_PASSWORD=passwordHere</b> ) and enter the Vercel Password. 
</p>

RJ Quick tools created by Reece Jarrels 10/25
