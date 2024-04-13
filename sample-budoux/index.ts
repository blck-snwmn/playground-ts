import { loadDefaultJapaneseParser } from "budoux";
const parser = loadDefaultJapaneseParser();
const text =
	"猫が犬と一緒に公園で絵を描いていた。その絵は宇宙飛行士になりたいバナナの夢を表現していた。するとバナナは突然踊り出し、猫と犬は驚いて逃げ出した。翌日、猫と犬がバナナを探しに行くと、バナナはすでに旅に出発していた。猫とバナナが一緒にスーパーマーケットに行った。バナナは牛乳を買うつもりだったが、猫が魚を買うことを提案した。そこで、二人は魚を買うために海に向かった。海に着くと、猫はサーフィンを始めた。バナナは砂浜で日光浴をしながら、哲学について考えていた。その後、二人はピザを食べに行くことにした。しかし、ピザ屋に着くと、店はすでに閉まっていた。がっかりした猫とバナナは、代わりに公園に行き、星空を見ながらギターを弾いた。";

console.log(text);
console.log(parser.parse(text));
