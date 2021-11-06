export function parseSentence(words: (string | number)[]): string {
    let sentence = "";
    for (let i = 1; i < words.length; i++) {
        sentence = sentence + words[i] + " ";
    }
    return sentence;
}