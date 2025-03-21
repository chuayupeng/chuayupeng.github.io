---
title: "Abusing Templating Engines: Remote Code Execution on Jenkins Workflow Script"
excerpt: "Deep dive into Jenkins Workflow Script and how template engines can offer interesting vulnerabilities"
date: "2023-09-04"
category: "cybersecurity"
author: "Yu Peng"
image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66"
---

## The Background
While off doing my work happily in a corner one day, I was approached by a colleague who noticed interesting behavior when supplying `'` values into certain fields (description of version) when trying to push a new build up in an internal system that was built on top of Jenkins.

![](../blogImg/abuse1.png)

Given the suspicious error message, we (me and Lee Jun Ao) opted to dive head first into the rabbit hole that is vulnerability hunting to try and get arbitrary code execution on the underlying server. This article is an attempt to record down the research and interesting twists and turns that came along while we were trying to trace the vulnerability down.

## The Hunt
Our first intuition was that the user input was being put into the environment block within the Jenkins Pipeline file, which was supported by the various error messages of environment block not being closed properly once we broke out of the multiline string (`'''`) and started to close the blocks with copious amounts of `}`. However, anything within the environment block had strict key=value syntax requirements, and it required a lot more thought and finicking with the payload before anything could be sent.
An example pipeline template is shown below to demonstrate:
```
pipeline {
    agent any
    environment {
        VERSION_NUM='1.1.0.1'
        VERSION_DESC='''<USER_INPUT>'''
        KEY=VALUE
        ...
    }
 …
}
```
Assuming that USER_INPUT is not sanitised before passing it into the template, the following payload could break out of the multiline string and add in additional environment variables that are now user controlled.
Payload:
```
123'''\nhello=\"world\"\ntest='''test
```
Following which, the final pipeline post insertion of the user input would look something like this:
```
pipeline {
    agent any
    environment {
        VERSION_NUM='1.1.0.1'
        VERSION_DESC='''123'''
hello="world"
test='''test'''
        KEY=VALUE
        ...
    }
 …
}
```
Once we were able to confirm this point, we wanted to try and achieve RCE based on an untrusted user input into a multiline string. Therein began the long and tedious build process of testing out various payloads to remain semantically faithful to the pipeline syntax while executing code from within the injection point of the environment block.

Attempts to close the pipeline prematurely and defining the remaining as string were thwarted by weird error messages like `No such DSL method`, to which nobody had a definite solution to even for the maintainers of various Jenkins git repos we found online. This was quite a blow to us, and did shake our beliefs a bit.

However, due to an earlier mistaken false alarm, we had already prematurely announced to the other teams that we achieved RCE, and because we did not want to lose face, we had to get the RCE working now or else we risked our credibility. The pressure was on.

![](../blogImg/abuse2.png)

What we did know was that we had an injection point within environment, but had to keep within the environment block and still maintain semantic correctness or else the script would not run. Further rabbitholes that we went into involved using methods like execute() and GroovyShell with String Interpolation. However, those methods are blocked by Groovy sandbox and needed explicit Jenkins admin approval before they could be run.

![](../blogImg/abuse3.png)

Many lessons in Jenkins Pipelines were learnt this day, but these were not useful whatsoever unless we were able to parse a string into an accepted format for the `key=value` pairing. We finally hit a breakthrough when we discovered the possibility of using withEnv to execute shell script.
```
node {
  withEnv(['key=value']) {
    sh 'echo execute command'
  }
}
```
With that idea in mind, we started crafting a potential payload containing withEnv with string interpolation `key="""${payload}"""` since we can only write `key=value` within the tag.

### Main Idea behind the payload
1. Break out of the initial multi-line quote by closing it off. A value must be present in front, otherwise string indexing error of -1 will occur. (`anyvalue'''`)
1. Write the withEnv payload in the format necessary for the environment section. (`payload="""${withEnv(['abc=abc']) { sh 'rce command' }}"""`)
1. We needed to close the remaining multi-line quote by writing a new environment variable, so that the pipeline script doesn't throw invalid parsing errors. (`newEnvVar='''test`)

With the payload, our pipeline injection attack would be something like this, which will then run normally in the pipeline script.
```
pipeline {
    agent any
    environment {
        normalEnvVar='''anyvalue'''
        payload="""${withEnv(['abc=abc']){ sh 'id'}}"""
        newEnvVar='''test'''
    }
    stages {
        stage('Test') {
            steps {
                sh 'node --version'
            }
        }
    }
}
```
Via the payload, we finally achieved the RCE we announced prior, and all was well. Clap claps to everyone involved in making this happen!

![](../blogImg/abuse4.jpg)

## The Application
Fresh off our victory with a RCE into the Jenkins instance, and thinking that we found a way to bypass the sandbox mechanisms in place, we thought of submitting a CVE to Jenkins directly. This was based on a mistaken assumption that user input could be plugged into the environment{} block directly in a normal case, which was exactly how our case was. Due to our lack of experience in handling Jenkins Pipeline, we assumed that as long as the above payload worked in the latest version of Jenkins, we had a code execution vulnerability on our hands, and happily wrote it up to submit in for a CVE.

## The Rejection
However, our assumptions were challenged multiple times, and after a day of back and forth with the Jenkins team, it was then brought to our attention that our vulnerability was in the templating engine that interfaced with the Jenkins pipeline instead, because it parsed user input directly in before passing the WorkFlowScript into the engine. Noting that we could not replicate the vulnerability in a fresh install of Jenkins without direct access to the environment block from a normal user's point of view, we got this response from the Jenkins team, and had to be content with just the learning experience and the joy of hunting for a RCE.

![](../blogImg/abuse5.png)

## The Conclusion
The experience and the learning gleaned from this was invaluable, and helped to solidify the interest in discovering interesting bugs. Since there was no CVE allocated to this vulnerability, we decided to just write it up and get some online brownie points.