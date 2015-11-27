# Math Facts App (WIP)
This is an app being developed at Khan Academy to explore how we can help people memorize their math facts, starting with multiplication tables and single-digit addition.

## Contributing
1. Install dependencies: `npm install`
2. Build iOS/main.jsbundle: `curl http://localhost:8081/index.ios.bundle\?dev\=0 -o iOS/main.jsbundle`
3. Open MathFacts.xcodeproj
4. Build and run app
5. Learn basic math facts ^_^

## To deploy via code push
Set up your [codepush account](http://microsoft.github.io/code-push/index.html#getting_started), and then run:
```
react-native bundle
code-push release MathFacts ./ios/main.jsbundle 1.0.0
```
