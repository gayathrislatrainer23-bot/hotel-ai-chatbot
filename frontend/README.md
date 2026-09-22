frontend
cd ../frontend
npm create vite@latest . -- --template react
npm install
npm install axios react-icons
 npm install -D tailwindcss@3 postcss autoprefixer   -----> npm install -D tailwindcss postcss                                                             autoprefixer (_not working) 
npx tailwindcss init -p  ?--->   This tells Tailwind: "look inside these files for any Tailwind classes I use, and only generate CSS for those" (keeps the final CSS file small, instead of including every possible Tailwind class).