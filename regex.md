# Regex for formatting test questions

### adjust right answer
```
\(\s([A-D])\s\)

===>

$1
```


### replace answers
```
\(A\)\s(\w+)\s\(B\)\s(\w+)\s\(C\)\s(\w+)\s\(D\)\s(\w+)\s?
or
\(A\)\s(.+)\s\(B\)\s(.+)\s\(C\)\s?(.+)\s\(D\)\s(.+)\s?

===>

\n"1": "$1",\n"2": "$2",\n"3": "$3",\n"4": "$4"\n
```


### add question line
```
(\w)\s(\d+)\.\s

===>

$1\n"id": $2,\n"question": "
```


### add answer block
```
\n("1":)

===>

\n"answers": {\n$1
```

### add question },
```
\n("answers": {)

===>

",\n$1
```

### fix question wrap (optional)
```
(\w)\n(\w)

===>

$1 $2
```

### convert to same end wrap
```
"\n([A-D])

===>

"\n\n$1
```

### add right_answer
```
\n\n([A-D])\n("id":)

===>

\n},\n"right_answer": \n},\n\n$1\n{\n$2
```


### answer add tab
```
("\d":\s)

===>

\t$1
```


### add item tab
```
("id.+)\n("question.+",\n)("answers.+)\n(\s+"\d".+)\n(\s+"\d".+)\n(\s+"\d".+)\n(\s+"\d".+)\n(}\,)\n("right_answer.+)

===>

\t$1\n\t$2\t$3\n\t$4\n\t$5\n\t$6\n\t$7\n\t$8\n\t$9
````


### remove char answer
```
},\n\n[A-D]\n{

===>

},\n{
```
