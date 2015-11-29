# Math Facts App (WIP)
This is an app being developed at Khan Academy to explore how we can help people memorize their math facts, starting with multiplication tables and single-digit addition.

## Playing the game
![Demo of playing the game](https://raw.github.com/Khan/math-facts/master/screenshots/demo-play-the-game.gif)

## Progress summary
![Demo of the progress screen](https://raw.github.com/Khan/math-facts/master/screenshots/demo-progress.gif)

## Changing your settings
![Demo of the settings menu](https://raw.github.com/Khan/math-facts/master/screenshots/demo-settings.gif)

## Contributing
1. Install dependencies: `npm install`
2. Build iOS/main.jsbundle: `curl http://localhost:8081/index.ios.bundle\?dev\=0 -o iOS/main.jsbundle`
3. Open MathFacts.xcodeproj
4. Build and run app
5. Learn basic math facts ^_^

## To deploy via code push
Set up your [codepush account](http://microsoft.github.io/code-push/index.html#getting_started), and then run:

```
react-native bundle --entry-file index.ios.js --bundle-output iOS/main.jsbundle --platform ios --dev false
code-push release MathFacts ./ios/main.jsbundle 1.0.1
```
```
react-native bundle --entry-file index.android.js --bundle-output android/app/src/main/assets/index.android.jsbundle --platform android --dev false
code-push release MathFacts ./android/app/src/main/assets/index.android.jsbundle 1.0.1
```
