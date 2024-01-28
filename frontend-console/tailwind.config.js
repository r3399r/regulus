/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        colors:{
            white:'#ffffff',
            grey:{
                50:'#fcfcfc',
                100:'#f8f8f8',
                200:'#e6e6e6',
                300:'#cdcdcd',
                500:'#969696',
                600:'#7a7a7a',
                700:'#5f5f5f',
                900:'#2a2a2a',
            },
            rose:{
                100:'#fbe7e3',
                900:'#8e211a',
            },
            skyblue:{
                100:'#d4ebf5',
                900:'#296181'
            },
            grass:{
                100:'#e0f5d9',
                900:'#0f542f',
            },
            indigo:{
                500:'#483be7'
            }
        },
        screens:{
            lg:'1680px',
            sm:'768px',
        }
    },
    plugins: [],
}