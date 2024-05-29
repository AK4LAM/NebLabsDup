**LAUNCH VENV**
source venv/bin/activate

**SET OPENAI KEY**
1. Run the following command in your terminal, replacing yourkey with your API key. 
```echo "export OPENAI_API_KEY='sk-proj-irO6EhC3hi78n3ihph5RT3BlbkFJLzpNeFtTPjN5MkGj614X'" >> ~/.zshrc```
 
2. Update the shell with the new variable:
```source ~/.zshrc```
 
3. Confirm that you have set your environment variable using the following command. 
```echo $OPENAI_API_KEY```