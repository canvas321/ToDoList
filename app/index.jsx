// This is a todo lesson on how to utilize CRUD, Create, Read, Update and Delete
// On React Native

import { Text, View, TextInput, Pressable, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from '@/app/context/ThemeContext'
import { data } from '@/app/data/todos'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";

import Octicons from '@expo/vector-icons/Octicons'

import Animated, {LinearTransition} from 'react-native-reanimated'

import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

import { useRouter } from "expo-router"

export default function Index() {

  // initialize todo variables, arrays and hooks for storing fetched data
  const [todos, setTodos] = useState([]);
  const [text,setText] = useState('');
  const { colorScheme, setColorScheme, theme} = useContext 
  (ThemeContext)
  const router = useRouter()


  // More standard font
  const [loaded, error] = useFonts({
    Inter_500Medium,
  })


  // For performance purposes, we have it after the app loads its fonts

  // Fetch data asynchronously
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("ToDoApp");
        // storedTodos is either an array or empty array if nothing is stored
        const storedTodos = jsonValue ? JSON.parse(jsonValue) : [];
        
        // Make a copy of your default todos from todos.js
        // (Assuming you imported it as "data" from '@/app/data/todos')
        const mergedTodos = [...data];
  
        // Merge stored todos:
        storedTodos.forEach(storedTodo => {
          // Check if the default array already has this todo (by id)
          const index = mergedTodos.findIndex(todo => todo.id === storedTodo.id);
          if (index >= 0) {
            // If it exists, override the default with the stored version (edited version)
            mergedTodos[index] = storedTodo;
          } else {
            // Otherwise, push the new todo into the merged array
            mergedTodos.push(storedTodo);
          }
        });
  
        // Optionally, sort the todos (e.g., descending by id)
        mergedTodos.sort((a, b) => b.id - a.id);
  
        setTodos(mergedTodos);
      } catch (e) {
        console.error(e);
      }
    };
  
    fetchData();
  }, []);
  

  // Store data assynchronously using async storage

  useEffect(() => {
    const storeData = async () => {
       try{
        const jsonValue = JSON.stringify(todos)
        await AsyncStorage.setItem("ToDoApp", jsonValue)
       } catch(e) {
        console.error(e)
       }
    }

    storeData()
  }, [todos ])

  
  if(!loaded && !error) {
    return null
  }

  // changed from initialized const to function
  const styles = createStyles(theme, colorScheme)

  // create function of (C)RUD
  const addTodo = () => {
    if(text.trim()){
      const newId = todos.length > 0 ? todos[0].id + 1: 1;
      setTodos([{id: newId, title: text, completed: false }, ...todos])
      setText('')
    }
  }

  // Update Function of CR(U)D
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo,completed: !todo.completed }: todo
    ))
  }

  // Delete Function of CRU(D)
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  // routing
  const handlePress = (id) => {
    router.push(`/todos/${id}`)
  }

  // Read Function of C(R)UD
  const renderItem = ({item}) => (
    <View style={styles.todoItem}>
      <Pressable
      // This is for edtiting
      onPress={() => handlePress(item.id)}
      // This is for marking a todo complete or incomplete
      onLongPress={() => toggleTodo(item.id)}>
      <Text 
      style={[styles.todoText, item.completed && styles.completedText]}
      
      >
        {item.title}
        </Text>
        </Pressable>
      <Pressable onPress={() => removeTodo(item.id)}>
        <MaterialCommunityIcons name="delete-circle" size={36} color="red" selectable={undefined} />
      </Pressable>
    </View>
  )
  
  return (
    // SafeAreaView handles crolling on phone screens
    <SafeAreaView style={styles.container}>
      
      <View >
      <Pressable
          onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')} style={{ marginLeft: 10 }}>

          <Octicons name={colorScheme === 'dark' ? "sun" : "moon"}
           size={36} color={theme.text} 
           selectable={undefined} 
           style={{ width: 36, right: 0, position:'fixed' }} />

        </Pressable>
      </View>

      {/* This view has no use, just to introduce space between toggle button and flatlist */}
      <View style={{ height: 40 }} /> 

      <Animated.FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={todo => todo.id}
        contentContainerStyle={{flexGrow: 1}}  
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
        />
        <View style={styles.inputContainer}>
        <TextInput 
        style={styles.input}
        maxLength={30}
        placeholder="Add a New ToDo"
        placeholderTextColor="gray"
        value={text}
        onChangeText={setText}
        />
        {/* Button */}
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>

        
      </View>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme){
  // the styling is pretty direct, follow through code and see where they have been used
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    width: '100%',maxWidth: 1024,
    marginHorizontal: 'auto',
  },

  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    fontSize: 18,
    fontFamily: 'Inter_500medium',
    minWidth: 0,
    color: theme.text,
  },

  addButton: {
    backgroundColor: theme.button,
    borderRadius: 5,
    padding: 10,
  },

  addButtonText: {
    fontSize: 18,
    color:colorScheme === 'dark' ? 'black' : 'white',
  },

  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    width: '100%',
    maxWidth: 1024,
    marginHorizontal:'auto',
    pointerEvents: 'auto',
  },

  todoText: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Inter_500medium',
    color: theme.text,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  }
})
}