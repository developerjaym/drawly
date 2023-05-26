
export default function(typeName) {
    return Array.from(typeName).map((letter, index) => index === 0 ? letter : letter.toLowerCase()).join("")
}